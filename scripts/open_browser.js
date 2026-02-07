
const { chromium } = require('playwright');

(async () => {
    console.log('Launching visible browser...');
    const browser = await chromium.launch({
        headless: false, // This makes the browser visible
        channel: 'chrome' // Try using installed Chrome if available, else standard Chromium
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to Admin Dashboard...');
    await page.goto('http://localhost:8080/admin');

    console.log('Browser is open. You can now interact with it.');
    console.log('Press Ctrl+C in the terminal to close this script, or close the browser window.');

    // Keep the script running so the browser stays open
    await new Promise(resolve => {
        browser.on('disconnected', resolve);
    });
})();
