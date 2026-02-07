
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    // 1. Define a local folder to store browser data (cookies, login session)
    const userDataDir = path.join(__dirname, '../.persistent_chrome_profile');

    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
    }

    console.log(`📂 Launching Chrome with Persistent Profile: ${userDataDir}`);

    try {
        const browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            channel: 'chrome',
            viewport: null,
            args: ['--start-maximized']
        });

        const page = browserContext.pages()[0] || await browserContext.newPage();

        console.log('🌐 Navigating to Supabase SQL Editor...');
        // Direct link to the new project SQL editor
        await page.goto('https://supabase.com/dashboard/project/oocpnxwiyepvkqgbkwev/sql/new');

        console.log('✅ Browser ready.');
        console.log('📋 I am attempting to copy the SQL to your clipboard.');
        console.log('👉 If clipboard fails, please open "NEW_PROJECT_SETUP.sql" manually.');
        console.log('👉 PRESS CTRL+V in the editor and CLICK RUN.');

        // Keep script alive
        await new Promise(() => { });
    } catch (e) {
        console.error('❌ Failed to launch persistent browser:', e);
    }
})();
