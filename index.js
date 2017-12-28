import AccountGenerator from './lib/account-generator';
import { createAccount } from './lib/creator';

const argv = require('minimist')(process.argv.slice(2));

const generator = new AccountGenerator({ numToGenerate: argv.amount });

(async() => {
    console.log('Beginning account generation: \n');
    await generator.generateAccounts();
})();
