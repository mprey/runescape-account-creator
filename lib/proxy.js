import config from '../config';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

class ProxyManager {

    /**
     * Create a new ProxyManager given the directory
     * of all the ovpn files.
     * @param {string} proxyDir 
     */
    constructor(proxyDir) {
        this.proxyDir = proxyDir;
        this.proxies = [];
        this.index = 0;

        process.on('exit', () => {
            for (const proxy of this.proxies) {
                proxy.disconnect();
            }
        });
    }

    /**
     * Read the proxy directory in asynchronous execution 
     * before the account generation takes place.
     * @param {string} path 
     */
    readdirAsync(path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Load all the ovpn files into Proxy objects 
     * and store them for the client.
     * @param {string} proxyDir the directory to load the ovpn files
     */
    async loadProxies() {
        try {
            const files = await this.readdirAsync(this.proxyDir);

            for (const file of files) {
                const filePath = path.join(this.proxyDir, file);
                if (filePath.includes('.ovpn')) {
                    this.proxies.push(new Proxy(filePath));
                }
            }
            this.shuffle();
        } catch (exception) {
            console.log('Error loading proxies: ' + exception);
            process.exit(1);
        }
    }

    /**
     * Shuffle the proxy array before getting the next index
     * in order to guarantee random order.
     */
    shuffle() {
        var currentIndex = this.proxies.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = this.proxies[currentIndex];
          this.proxies[currentIndex] = this.proxies[randomIndex];
          this.proxies[randomIndex] = temporaryValue;
        }      
    }

    /**
     * Get the next proxy based off the indexes
     * of the proxy list.
     */
    async getNextProxy() { // gets the next proxy in the order of the indexes
        if (!this.loaded) {
            await this.loadProxies();
        }
        if (this.proxies.length === 0) {
            throw new Error('No proxies available');
        }

        if (this.index >= this.proxies.length) {
            this.index = 0;
        }
        return this.proxies[this.index];
    }

}

/**
 * A wrapper class for the ovpn file. Automatically
 * handles connecting and disconnecting from proxies.
 */
class Proxy {

    /**
     * Create a new Proxy given the config file.
     * @param {*string} proxyFile 
     */
    constructor(proxyFile) {
        this.proxyFile = proxyFile; // Add a directory up because this file is within lib/
        this.connected = false;
    }

    /**
     * Get the file name of the current proxy for 
     * the output file.
     */
    getProxyName() {
        let proxyName = this.proxyFile + "";
        if (this.proxyFile.includes("/")) {
            proxyName = this.proxyFile.split("/").slice(-1).pop();
        }
        return proxyName.slice(0, -5); // Remove .ovpn
    }

    /**
     * Connect the proxy using the OpenVPN CLI.
     */
    async connect() {
        console.log('Attempting to connect to a proxy...');
        if (!this.proxyFile) {
            throw new Error('Attempted to connect to a proxy without a config file')
        }
        if (this.process && this.process.kill) {
            await this.disconnect();
        }

        this.process = exec(`openvpn ${this.proxyFile}`);

        return new Promise((resolve, reject) => {
            this.process.stdout.on('data', (data) => {
                if (data && data.includes('Initialization Sequence Completed')) {
                    this.connected = true;
                    this.process.stdout.removeAllListeners('data');
                    clearTimeout(timeout);
                    console.log('Connected to a proxy: ' + this.getProxyName());
                    return resolve();
                }
            });
            
            const timeout = setTimeout(() => {
                this.process.stdout.removeAllListeners('data');
                this.connected = false;
                return reject(new Error('Proxy connection timed out'));
            }, 15 * 1000);
        });
    }

    /**
     * Disconnect the proxy using the child_process API.
     */
    async disconnect() {
        if (!this.connected) { // Ignore proxies that are not connected
            return;
        }
        console.log('Disconnecting from the proxy...');
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                return reject('Attempted to disconnect from a nonconnected proxy');
            } else if (!this.process) {
                return reject('No child process defined');
            }
            this.process.kill();
            this.process.on('close', (code) => {
                console.log('Disconnected from the proxy.');
                this.connected = false;
                this.process.removeAllListeners('close');
                this.process = null;
                return resolve(code);
            });
        })
    }

}

// Use a singleton
const proxyManager = new ProxyManager(config.proxiesDir);

export default proxyManager;