# Amigo AI Chatbot Troubleshooting 🤖✈️

If you see the message: **"Oops! I hit a bit of turbulence."**, it means the chatbot cannot connect to the Gemini API.

## Most Likely Cause: API Key Not Loaded

The `VITE_GEMINI_API_KEY` was added to `.env`, but Vite requires a **server restart** to pick up new environment variables.

### 🛠️ Solution:

1.  **Stop** the development server (Ctrl+C in your terminal).
2.  **Restart** the server:
    ```bash
    npm run dev
    ```
3.  **刷新 (Refresh)** the page.

## Other Checks:

-   **Check Console:** Open Developer Tools (F12) -> Console.
    -   Look for: `❌ CRTICAL ERROR: VITE_GEMINI_API_KEY is missing...`
    -   Look for: `Error details: ...` (e.g., 401 Unauthorized, 404 Not Found)

-   **Check Dependencies:**
    Ensure you ran:
    ```bash
    npm install @google/generative-ai react-markdown
    ```

If the error persists after restarting, please share the **"Error details:"** from the browser console.
