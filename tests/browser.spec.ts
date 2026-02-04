
import { test, expect } from '@playwright/test';

test('Autonomous Quiz Walkthrough (17 Steps)', async ({ page }) => {
    test.setTimeout(90000); // Increase timeout for 17 steps
    // 1. Open the Quiz
    console.log('Navigating to quiz...');
    await page.goto('http://localhost:8080/quiz');

    // 2. Wait for content
    // Step 1: Companion
    await expect(page.locator('h2')).toContainText(/Who are you travell?ing with/i);
    console.log('Step 1: Companion loaded.');
    await page.click('text=Solo');
    await page.click('button:has-text("Continue")');

    // Step 2: Departure City
    await expect(page.locator('h2')).toContainText(/Which city will you start from/i);
    console.log('Step 2: Departure loaded.');
    await page.fill('input[type="text"]', 'London');
    await page.waitForTimeout(1000); // Wait for suggestions
    await page.keyboard.press('Enter'); // Select first suggestion or just submit
    // Need to click "Next" or "Continue" if it's not auto-advance. Step 2 usually requires manual continue if validation passes.
    // Check if there is a continue button.
    // In QuizContainer, footer has navigation.
    await page.click('button:has-text("Continue")');

    // Step 3: Passport
    await expect(page.locator('h2')).toContainText(/Which passport do you travel with/i);
    console.log('Step 3: Passport loaded.');
    await page.click('text=Other Passport');
    await page.click('button:has-text("Continue")');

    // Step 4: Destination Preference
    await expect(page.locator('h2')).toContainText(/Where would you like to go/i);
    console.log('Step 4: Dest Preference loaded.');
    await page.click("text=open to anywhere");
    await page.click('button:has-text("Continue")');
    // If we pick flexible, we might skip Step 5

    // Step 5: Desired Destinations (Conditional)
    // If logic skips 5, we expect Step 6. Let's wait for either.
    // However, if we picked "flexible", logic usually skips 5.

    // Step 6: Places to Avoid
    await expect(page.locator('h2')).toContainText(/Any places you want to avoid/i);
    console.log('Step 6: Avoid loaded.');
    await page.click('button:has-text("Continue")'); // Skip

    // Step 7: Trip Styles
    await expect(page.locator('h2')).toContainText(/What kind of trip do you enjoy/i);
    console.log('Step 7: Style loaded.');
    await page.click('text=Relaxed'); // Select one
    await page.click('button:has-text("Continue")');

    // Step 8: Pace
    await expect(page.locator('h2')).toContainText(/travel pace preference/i);
    console.log('Step 8: Pace loaded.');
    await page.click('text=Balanced');
    await page.click('button:has-text("Continue")');

    // Step 9: Hard No Activities
    await expect(page.locator('h2')).toContainText(/Anything you'd like us to avoid/i);
    console.log('Step 9: Hard No loaded.');
    await page.click('button:has-text("Continue")'); // Skip

    // Step 10: Food Prefs
    await expect(page.locator('h2')).toContainText(/food preferences/i);
    console.log('Step 10: Food loaded.');
    await page.click('button:has-text("Continue")'); // Skip

    // Step 11: Health
    await expect(page.locator('h2')).toContainText(/conditions we should know about/i);
    console.log('Step 11: Health loaded.');
    await page.click('button:has-text("Continue")'); // Skip

    // Step 12: Duration
    await expect(page.locator('h2')).toContainText(/How long do you want to travel/i);
    console.log('Step 12: Duration loaded.');
    await page.click('text=6-9 Days');
    await page.click('button:has-text("Continue")');

    // Step 13: Budget
    await expect(page.locator('h2')).toContainText(/budget range/i);
    console.log('Step 13: Budget loaded.');
    await page.click('text=Mid-Range');
    await page.click('button:has-text("Continue")');

    // Step 14: Dates
    await expect(page.locator('h2')).toContainText(/When are you planning/i);
    console.log('Step 14: Dates loaded.');
    await page.click("text=I'm open to suggestions");
    await page.click('button:has-text("Continue")');

    // Step 15: Amigo Role
    await expect(page.locator('h2')).toContainText(/How can Travel Amigo help/i);
    console.log('Step 15: Role loaded.');
    await page.click('text=Build a custom plan');
    await page.click('button:has-text("Continue")');

    // Step 16: Knowledge
    await expect(page.locator('h2')).toContainText(/Do you want to know the destination/i);
    console.log('Step 16: Knowledge loaded.');
    await page.click('text=Surprise Me');
    await page.click('button:has-text("Continue")');

    // Step 17: Vibe
    await expect(page.locator('h2')).toContainText(/What's your travel vibe/i);
    console.log('Step 17: Vibe loaded.');
    await page.click('text=The Relaxer'); // Select matching option text
    // Depending on logic, might need to click Submit or it might auto-submit/show complete.
    // Step 17 usually requires button "Start Adventure" for submission (Last step).
    // For anonymous users, the button is "Continue to Sign Up"
    await page.click('button:has-text("Continue to Sign Up")');

    // Verify Completion
    // Expect redirection to dashboard or completion screen
    // QuizContainer shows QuizComplete component or redirects.
    // The code says: setShowComplete(true) OR navigate('/dashboard').
    // Let's wait for URL change or success message.
    // Expect Auth Prompt for anonymous user
    await expect(page.locator('h2').filter({ hasText: 'Save Your Trip Preferences' })).toBeVisible();
    console.log('Auth Prompt appeared!');
    console.log('Successfully completed quiz!');
});
