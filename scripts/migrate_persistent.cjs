
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('🚀 Starting Automated Migration (Final Attempt)...');

    const userDataDir = path.join(__dirname, '../.persistent_chrome_profile');
    const sqlPath = path.join(__dirname, '../NEW_PROJECT_SETUP.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📂 Opening browser with saved profile...');
    try {
        const browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            channel: 'chrome',
            viewport: null,
            args: ['--start-maximized']
        });

        const page = browserContext.pages()[0] || await browserContext.newPage();

        const projectId = 'oocpnxwiyepvkqgbkwev';
        const targetUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

        console.log('🌐 Navigating to SQL Editor...');
        await page.goto(targetUrl);

        if (page.url().includes('login') || page.url().includes('sign-in')) {
            console.log('⚠️ Login required! Please log in manually.');
            await page.waitForURL((url) => url.toString().includes('/sql'), { timeout: 0 });
        }

        console.log('🤖 Automating SQL execution...');

        const editorSelector = '.monaco-editor, [role="textbox"]';
        try {
            await page.waitForSelector(editorSelector, { timeout: 15000 });
            await page.click(editorSelector);
        } catch (e) {
            console.log('⚠️ Editor selector fallback...');
        }

        console.log('📝 Pasting SQL...');
        await page.evaluate((text) => {
            navigator.clipboard.writeText(text).catch(e => console.error('Clipboard error:', e));
        }, sqlContent);

        await page.keyboard.press('Control+V');
        await page.waitForTimeout(1000);

        console.log('🔍 Scanning for Run button...');

        // Debug: List all buttons to see what we can find
        const buttons = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('button')).map(b => ({
                text: b.innerText,
                class: b.className,
                visible: b.offsetParent !== null
            }));
        });
        const runButtons = buttons.filter(b => b.text.includes('Run'));
        console.log('📋 Found Run-like buttons:', runButtons);

        // Try to click via DOM evaluation (more robust than selectors)
        console.log('🖱️ Attempting JS Click on "Run" button...');
        const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const runBtn = btns.find(b => b.innerText.trim().includes('Run') && b.offsetParent !== null); // Visible only
            if (runBtn) {
                runBtn.style.border = '5px solid red'; // Highlight for user
                runBtn.click();
                return true;
            }
            return false;
        });

        if (clicked) {
            console.log('✅ JS Code says it clicked the button!');
        } else {
            console.warn('⚠️ JS could not find the button. Trying Shortcut...');
            await page.keyboard.press('Control+Enter');
        }

        console.log('⏳ Waiting for execution (10s)...');
        await page.waitForTimeout(10000);

        console.log('📸 Taking result screenshot (migration_attempt_js_click.png)...');
        try {
            await page.screenshot({ path: 'migration_attempt_js_click.png', fullPage: true });
        } catch (e) { }

        console.log('🏁 Script finished. Window open for manual review.');
        await new Promise(() => { });

    } catch (e) {
        console.error('❌ Automation Error:', e.message);
        if (e.message.includes('lock')) {
            console.error('🔒 ERROR: Browser profile locked. Please CLOSE Chrome.');
        }
    }
})();
