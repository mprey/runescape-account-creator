export default {
    proxiesDir: 'proxies/', // The directory the proxy files are located (.ovpn)
    outputFile: 'accounts.txt', // The output file to output the accounts
    twoCaptchaApiKey: '', // The API key for 2Captcha
    use2Captcha: false, // Turn on 2Captcha authentication (as opposed to manual authentication)
    useProxies: true, // Turn on proxies for accounts
    maxFailures: 10, // Max failures before the process will exit
    numToGenerate: 5, // Number of accounts to generate per process
    accountsPerProxy: 3 // Number of accounts to generate per proxy (do not go over 3 or RuneScape will error)
}