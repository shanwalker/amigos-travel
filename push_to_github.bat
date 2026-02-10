@echo off
echo ======================================================================
echo  Pushing Latest Changes to GitHub
echo ======================================================================

git add .
git commit -m "feat: Admin Proposals, Chat Logging, and Dashboard Fixes"

echo.
echo ======================================================================
echo  Pushing to Remote (main)...
echo ======================================================================

git push origin main

echo.
echo ======================================================================
echo  Done! Your code is now updated on GitHub.
echo ======================================================================
pause
