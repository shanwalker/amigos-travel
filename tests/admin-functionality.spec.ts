
import { test, expect } from '@playwright/test';

// Mock Data
const mockAdminUser = {
    id: 'test-admin-id',
    email: 'admin@travelamigo.com',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Test Admin', role: 'admin' },
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString()
};

const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWFkbWluLWlkIiwiYXVkIjoiYXV0aGVudGljYXRlZCIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNjAwMDAwMDAwLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImVtYWlsIjoiYWRtaW5AdHJhdmVsYW1pZ28uY29tIn0.signature';

const mockSession = {
    access_token: mockJwt,
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: mockAdminUser,
    token_type: 'bearer'
};

const mockRoles = [{ role: 'admin' }];

const mockTrips = [
    {
        id: '1',
        title: 'Bali Adventure',
        status: 'active',
        price: 1200,
        slug: 'bali-adventure',
        destination: 'Bali',
        country: 'Indonesia',
        duration_days: 7,
        spots_left: 10,
        total_spots: 20,
        trip_type: 'group_fixed',
        is_featured: true,
        image_url: 'https://example.com/bali.jpg'
    },
    {
        id: '2',
        title: 'Tokyo Explorer',
        status: 'draft',
        price: 2500,
        slug: 'tokyo-explorer',
        destination: 'Tokyo',
        country: 'Japan',
        duration_days: 10,
        spots_left: 5,
        total_spots: 15,
        trip_type: 'standard',
        is_featured: false,
        image_url: 'https://example.com/tokyo.jpg'
    }
];

const mockUsers = [
    { id: '1', email: 'user1@example.com', full_name: 'User One', roles: ['user'], created_at: new Date().toISOString() },
    { id: '2', email: 'user2@example.com', full_name: 'User Two', roles: ['user'], created_at: new Date().toISOString() },
    { id: 'test-admin-id', email: 'admin@travelamigo.com', full_name: 'Test Admin', user_metadata: { role: 'admin' }, roles: ['admin'], created_at: new Date().toISOString() }
];

const mockBookings = [
    {
        id: '1',
        status: 'confirmed',
        total_amount: 1200,
        amount_paid: 1200,
        payment_status: 'paid',
        guest_count: 1,
        trip_date: { start_date: '2026-06-01' },
        profile: { full_name: 'User One', email: 'user1@example.com' }, // UI might expect 'customer_name' which comes from join? No, let's check code. 
        // BookingsManagement uses useBookings hook.
        // Assuming hook joins profile as 'customer_name' or similar?
        // Let's mock what the hook returns. 
        // Actually, BookingsManagement.tsx:39 uses `booking.customer_name`.
        customer_name: 'User One',
        customer_email: 'user1@example.com',
        trip: { title: 'Bali Adventure' }
    }
];

const mockQuizzes = [
    {
        id: '1',
        user_id: '1',
        status: 'completed', // UI uses 'completion_status'? Check code.
        completion_status: 'completed',
        created_at: new Date().toISOString(),
        admin_reviewed: false,
        profile: { full_name: 'User One', email: 'user1@example.com' } // Component uses `profiles.full_name`?
        // OnboardingQuizzesManagement line 47 uses `quiz.profiles?.full_name`.
    }
];

test.describe('Admin Dashboard Functionality', () => {

    test.beforeEach(async ({ page }) => {
        try {
            // Enable Console Logs
            page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
            // Debug Requests
            page.on('request', request => console.log('>>', request.method(), request.url()));
            page.on('response', response => console.log('<<', response.status(), response.url()));

            // 1. Mock Supabase Auth Routes
            await page.route('**/auth/v1/user', async route => {
                await route.fulfill({ json: mockAdminUser });
            });

            await page.route('**/auth/v1/session', async route => {
                await route.fulfill({ json: mockSession });
            });

            // 2. Mock User Roles
            await page.route('**/rest/v1/user_roles*', async route => {
                await route.fulfill({ json: mockRoles });
            });

            // 3. Mock Data Routes
            await page.route('**/rest/v1/trips*', async route => {
                await route.fulfill({ json: mockTrips });
            });

            // Smart Mock for Profiles
            await page.route('**/rest/v1/profiles*', async route => {
                const url = route.request().url();
                if (url.includes('id=eq.test-admin-id')) {
                    await route.fulfill({ json: [mockUsers.find(u => u.id === 'test-admin-id')] });
                } else {
                    await route.fulfill({ json: mockUsers });
                }
            });

            await page.route('**/rest/v1/bookings*', async route => {
                await route.fulfill({ json: mockBookings });
            });

            await page.route('**/rest/v1/onboarding_quiz_responses*', async route => {
                await route.fulfill({ json: mockQuizzes });
            });

            await page.route('**/rest/v1/testimonials*', route => route.fulfill({ json: [] }));
            await page.route('**/rest/v1/travel_stories*', route => route.fulfill({ json: [] }));
            await page.route('**/rest/v1/surprise_requests*', route => route.fulfill({ json: [] }));
            await page.route('**/rest/v1/custom_requests*', route => route.fulfill({ json: [] }));
            await page.route('**/rest/v1/trip_reservations*', route => route.fulfill({ json: [] }));
            await page.route('**/rest/v1/local_buddies*', route => route.fulfill({ json: [] }));

            // 4. Set Session in LocalStorage
            console.log('Test setup: Navigating to login...');
            await page.goto('http://localhost:8080/admin/login');
            console.log('Test setup: Setting local storage...');
            await page.evaluate((session) => {
                const projectId = 'oocpnxwiyepvkqgbkwev';
                localStorage.setItem(`sb-${projectId}-auth-token`, JSON.stringify(session));
            }, mockSession);
            console.log('Test setup: Complete');
        } catch (error) {
            console.error('Test Setup Failed:', error);
            throw error;
        }
    });

    test('1. Verify Admin Overview Loads', async ({ page }) => {
        try {
            await page.goto('http://localhost:8080/admin');
            await page.waitForTimeout(2000); // Give it a moment to render

            await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible();
            await expect(page.locator('h1')).toHaveText('Admin Dashboard', { timeout: 15000 });
            console.log('✓ Admin Overview Verified');
        } catch (e: any) {
            console.log('❌ Admin Verification Failed.');
            console.log('Current URL:', page.url());
            console.log('Error:', e.message);

            const storage = await page.evaluate(() => JSON.stringify(localStorage));
            console.log('LocalStorage:', storage);

            await page.screenshot({ path: 'c:/Users/shan/.gemini/antigravity/brain/72924ee3-3ff4-4161-bba7-34eb9b87f20a/admin_fail.png' });
            throw e;
        }
    });

    test('2. Verify Trips Module', async ({ page }) => {
        await page.goto('http://localhost:8080/admin/trips');
        // Wait for the table to appear
        await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('heading', { name: 'Trip Management' })).toBeVisible();
        await expect(page.getByText('Bali Adventure')).toBeVisible();
        console.log('✓ Trips Module Verified');
    });

    test('3. Verify Users Module', async ({ page }) => {
        await page.goto('http://localhost:8080/admin/users');
        await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
        await expect(page.getByText('User One')).toBeVisible();
        console.log('✓ Users Module Verified');
    });

    test('4. Verify Bookings Module', async ({ page }) => {
        await page.goto('http://localhost:8080/admin/bookings');
        await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible();
        await expect(page.getByText('Bali Adventure')).toBeVisible();
        console.log('✓ Bookings Module Verified');
    });

    test('5. Verify Onboarding Quizzes Module', async ({ page }) => {
        await page.goto('http://localhost:8080/admin/onboarding-quizzes');
        await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('heading', { name: 'Onboarding Quizzes' })).toBeVisible();
        await expect(page.getByText('User One')).toBeVisible();
        console.log('✓ Quizzes Module Verified');
    });

    test('6. Verify Settings Module', async ({ page }) => {
        await page.goto('http://localhost:8080/admin/settings');
        await expect(page.getByText('Platform Settings')).toBeVisible({ timeout: 15000 });
        console.log('✓ Settings Module Verified');
    });

});
