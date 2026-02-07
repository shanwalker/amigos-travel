
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('🚀 Preparing to run database migration...');

    // 1. Read the SQL File
    const sqlPath = path.join(__dirname, '../NEW_PROJECT_SETUP.sql');
    let sqlContent;
    try {
        sqlContent = fs.readFileSync(sqlPath, 'utf8');
        console.log(`✅ Loaded SQL file (${sqlContent.length} bytes)`);
    } catch (e) {
        console.error('❌ Failed to read NEW_PROJECT_SETUP.sql:', e);
        process.exit(1);
    }

    // 2. Launch Browser (Persistent Context attempt)
    const userDataDir = path.join(__dirname, '../.browser-profile');
    console.log(`📂 Using profile: ${userDataDir}`);

    const browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: 'chrome',
        viewport: null
    });

    const page = browser.pages()[0] || await browser.newPage();

    try {
        // 3. Navigate to SQL Editor
        const projectId = 'oocpnxwiyepvkqgbkwev';
        const targetUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

        console.log('🌐 Navigating to Supabase SQL Editor...');
        await page.goto(targetUrl);

        // 4. Handle Login Requirement
        if (page.url().includes('login') || page.url().includes('sign-in')) {
            console.log('🔒 Login required!');
            console.log('👉 PLEASE LOG IN MANUALLY IN THE BROWSER WINDOW.');
            console.log('⏳ Waiting for you to reach the SQL Editor...');

            // Wait indefinitely for the user to complete login and reach the dashboard
            await page.waitForURL((url) => url.toString().includes('/sql'), { timeout: 0 });
            console.log('🔓 Login detected! Proceeding...');
            // Small delay to let UI settle
            await page.waitForTimeout(3000);
        }

        // 5. Interact with SQL Editor
        console.log('🤖 Automating SQL execution...');

        // Wait for the editor to be ready (Monaco editor usually)
        // We might need to click specifically into the legacy editor or the new one.
        // Try multiple selectors common in Supabase UI
        const editorSelector = '.monaco-editor, [role="textbox"]';
        try {
            await page.waitForSelector(editorSelector, { timeout: 10000 });
            await page.click(editorSelector);
        } catch (e) {
            console.log('⚠️ Could not find specific editor selector, trying generic body focus...');
        }

        console.log('📝 Pasting SQL content...');
        // Use clipboard or insertText for speed
        await page.evaluate((text) => {
            // Attempt to write to clipboard and paste (requires permission, fallback to insert)
            navigator.clipboard.writeText(text).catch(e => console.error('Clipboard failed', e));
        }, sqlContent);

        // Fallback: Keyboard insert
        // Split into chunks if too large? Playwright handles large strings usually.
        // But for safety, let's use a simpler method if possible: setting value of a hidden input?
        // Monaco is complex. keystrokes are safest.
        await page.keyboard.press('Control+A'); // Select all
        await page.keyboard.press('Backspace'); // Clear
        await page.keyboard.insertText(sqlContent);

        console.log('▶️ Executing SQL...');
        // Look for the "Run" button. It usually says "Run" or has a play icon.
        const runButton = page.getByRole('button', { name: /run/i }).first();
        await runButton.waitFor({ state: 'visible', timeout: 5000 });
        await runButton.click();

        console.log('✅ SQL script executed! Checks results in browser.');
        console.log('🛑 SCRIPT FINISHED. Closing in 5 minutes (or close window manually).');

        await page.waitForTimeout(300000); // Keep open for review

    } catch (e) {
        console.error('❌ Automation Error:', e);
        // Keep window open for debugging
        await page.waitForTimeout(300000);
    } finally {
        await browser.close();
    }
})();
