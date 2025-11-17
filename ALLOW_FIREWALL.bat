@echo off
echo ============================================
echo  Adding Firewall Rule for Estimator App
echo ============================================
echo.
echo This will allow connections to port 3000
echo.

netsh advfirewall firewall add rule name="Estimator Web App" dir=in action=allow protocol=TCP localport=3000

echo.
echo ============================================
echo  Firewall rule added successfully!
echo ============================================
echo.
echo You can now access the app from your phone
echo.
pause
