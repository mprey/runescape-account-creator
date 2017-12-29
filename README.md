## Oldschool RuneScape Account Creator CLI

Easily create Oldschool Runescape accounts from a CLI

## Prerequisites

### OpenVPN

You must have [OpenVPN](https://openvpn.net/) installed in your system (CLI) and have configuration files for proxies if you wish to enable the use of proxies with this script.

### Sudo

This script must be run with sudo because [OpenVPN](https://openvpn.net/) requires `sudo` access to your system in order to modify network preferences. You can check the code to verify no other use of `sudo` is present.

### NodeJS/Chromium

Your system must have Node.js installed and be compatible with [Chromium](https://www.chromium.org/Home). 

## Installation

Open up Terminal/Run and enter the following commands.

Make sure you have Node.js installed before running this script.

```
git clone https://github.com/mprey/runescape-account-creator.git
cd runescape-account-creator
npm install
sudo npm start
```

## Configuration
All the configuration can be found within config.js inside of the project folder.

#### proxiesDir
The directory where all of the OpenVPN files (.ovpn) are kept. The script will automatically read-in and process all the files in this directory.

#### outputFile
The file where created accounts will be written. Outputs the email, password, and the .ovpn used when creating the account.

#### twoCaptchaApiKey
If you are using 2Captcha automated, you must provide an API key that will be used for reCAPTCHA.

#### use2Captcha
Set this field to true if you wish to automatically create accounts using 2Captcha. The browser will not open and the script will run in the background.

#### useProxies
Set this field to true if you wish to use proxies when creating accounts. RuneScape will automatically blacklist IPs temporarily if too many accounts are created in a short period of time so this is recommended.

#### maxFailures
The maximum amount of errors the script will endure before automatically exiting the process.

#### numToGenerate
The amount of accounts to generate before the process will automatically exit.

#### accountsPerProxy
The amount of accounts the script will create on one single proxy before switching to a different proxy. Helps deter blacklisting IPs from RuneScape's side for mass account creation.

## Usage 

### 2Captcha
**NOT YET IMPLEMENTED**

### Manual

Run the script following the Installation section, then proceed to watch the code automatically enter details into the account creation forms on RuneScape's website. Once this has finished, verify the reCAPTCHA and click submit. Once the success page has loaded, this process will restart and a new page will open. It sometimes helps to speed up reCAPTCHAS by signing into a Google account on a different tab and saving those cookies into Chromium. All accounts created will be outputted to the output file.