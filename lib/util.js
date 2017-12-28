// list of all the known email providers
const EMAIL_PROVIDERS = [
    'gmail.com',
    'aol.com',
    'comcast.net',
    'yahoo.com',
    'direct.tv',
    'dow.com'
];

/**
 * Generate a random display name. Always 
 * 12 characters to maximize the chance to avoid
 * duplicates.
 */
export function generateDisplayName() {
    return generateString(12);
}

/**
 * Generate a random string of a given length.
 * @param {number} length the length of the string
 */
function generateString(length) {
    var text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Generate a random age between 19 and 30 years.
 */
export function generateAge() {
    return Math.floor(Math.random() * (30 - 19 + 1) + 19) + ""; // generate age 19-30
}

/**
 * Generate a random number between two given interval bounds.
 * @param {number} min 
 * @param {number} max 
 */
export function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generate a random email that includes a 
 * randomly generated string for the username and 
 * a random provider from a given list.
 */
export function generateEmail() {
    const header = generateString(Math.floor(Math.random() * (13 - 8 + 1) + 8)); // random string with # chars 5-10
    const provider = EMAIL_PROVIDERS[Math.floor(Math.random() * EMAIL_PROVIDERS.length)];

    return `${header}@${provider}`;
}

/**
 * Generate a random password that contains 
 * 8-15 random characters.
 */
export function generatePassword() {
    return generateString(Math.floor(Math.random() * (15 - 10 + 1) + 10)) // random string with # chars 8-15
}