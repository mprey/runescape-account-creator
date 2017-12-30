import _ from 'lodash';
import proxyManager from './proxy';
import config from '../config';
import fs from 'fs';
import Account from './account';
import { createAccount, create2CaptchaAccount } from './creator';

const MAX_FAILURES = config.maxFailures;

export default class AccountGenerator {

    /**
     * Create a new Account Generator object to
     * generate accounts. Handles proxies and outputting 
     * files automatically.
     * @param {object} options 
     */
    constructor(options) {
        this.options = _.defaults(options, {
            use2Captcha: config.use2Captcha,
            useProxies: config.useProxies,
            outputFile: config.outputFile,
            numToGenerate: config.numToGenerate, 
            maxFailures: config.maxFailures,
            accountsPerProxy: config.accountsPerProxy
        });
        this.currentProxy = null;
    }

    /**
     * Generate accounts based on the options 
     * provided in the constructor.
     */
    async generateAccounts() {
        if (this.options.useProxies) {
            await this.connectToProxy();
        }

        let failures = 0, created = 0;
        for (let i = 0; i < this.options.numToGenerate; i++) {
            try {
                const account = await this.generateAccount();
                console.log(`(${++created}/${this.options.numToGenerate}) Created account: ${account.toString()}\n`);
                if (this.options.useProxies && created % this.options.accountsPerProxy === 0) {
                    await this.connectToProxy();
                }
            } catch (exception) {
                failures++;
                console.log('Error generating account: ' + exception);
                console.log(`Failures: (${failures}/${MAX_FAILURES})`);
                if (failures == MAX_FAILURES) {
                    process.exit(1);
                }
            }
        }
    }

    async connectToProxy() {
        if (this.currentProxy) {
            await this.currentProxy.disconnect();
        }

        this.currentProxy = await proxyManager.getNextProxy();

        await this.currentProxy.connect();
    }

    /**
     * Generate an account with a given proxy. Uses 
     * 2Captcha or manual authentication based off of 
     * @property options.
     * @param {Proxy} proxy 
     */
    async generateAccount() {
        let account;
        if (this.options.use2Captcha) {
            account = new Account(await create2CaptchaAccount(), this.currentProxy);
        } else {
            account = new Account(await createAccount(), this.currentProxy);
        }

        await fs.appendFile(this.options.outputFile, "\n" + account.toString(), (error) => {/* ignore error */});

        return account;
    }

}