@echo off
echo Debugging Git Push...
echo ====================================================================== > git_debug_log.txt 2>&1
echo TIMESTAMP: %date% %time% >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo CHECKING GIT VERSION: >> git_debug_log.txt 2>&1
git --version >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo CHECKING REMOTE: >> git_debug_log.txt 2>&1
git remote -v >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo CHECKING STATUS: >> git_debug_log.txt 2>&1
git status >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo ADDING FILES... >> git_debug_log.txt 2>&1
git add . >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo COMMITTING... >> git_debug_log.txt 2>&1
git commit -m "feat: Admin Proposals, Chat Logging, Dashboard Fixes" >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo PUSHING... >> git_debug_log.txt 2>&1
git push origin main >> git_debug_log.txt 2>&1
echo. >> git_debug_log.txt 2>&1

echo ======================================================================
echo Debug log saved to git_debug_log.txt
echo Please share the contents of this file if the push failed.
pause
