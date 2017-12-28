import { generateEmail, generatePassword, generateAge, generateDisplayName, generateRandom } from './util';
import puppeteer from 'puppeteer';

const CREATE_URL = 'https://secure.runescape.com/m=account-creation/g=oldscape/create_account';

let browser, headlessBrowser;

/**
 * Create an account with manual ReCaptcha authentication.
 */
export async function createAccount() {
    if (!browser) {
        browser = await puppeteer.launch({headless: false});
    }
    const page = await browser.newPage();

    const email = generateEmail(), password = generatePassword();

    await page.goto('https://secure.runescape.com/m=account-creation/g=oldscape/create_account');

    // Wait for the page to be completely loaded before trying to type
    await page.waitForSelector('#create-email', {timeout: 10000});

    // Enter in random details for the user
    await page.type('#create-email', email);
    await page.type('#create-password', password);
    await page.type('#display-name', generateDisplayName());
    await page.type('#create-age', generateAge());

    /*
    // Wait for Google's ReCaptcha to be completed by the user
    const recaptchaSelector = '.recaptcha-checkbox-checked';
    const frame = await page.frames().find(f => f.url().includes('https://www.google.com/recaptcha/api2/anchor'));
    await frame.waitForSelector(recaptchaSelector, {timeout: 60 * 60 * 10000}); // 1 hour

    // Submit the create account button
    console.log('Clicking submit');
    const submit = await page.click('#create-submit');
    */

    // Wait for the success page to load
    await page.waitForNavigation({timeout: 45 * 1000}); // 45 seconds

    // Close the current page
    await page.close();
    
    return { email, password };
}

export async function create2CaptchaAccount() {
    console.log('** NOT IMPLEMENTED **');
    return null;
}