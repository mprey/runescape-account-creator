export default class Account {

    constructor({ email, password }, proxy) {
        this.email = email;
        this.password = password;
        this.proxyString = proxy ? proxy.getProxyName() : null;
    }

    toString() {
        return `${this.email}:${this.password}${this.proxyString ? ` - ${this.proxyString}` : ''}`
    }

}