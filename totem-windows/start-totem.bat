@echo off
REM ==============================================
REM MAVI PUZZLE - TOTEM STARTUP SCRIPT (Windows)
REM ==============================================
REM Script per avviare automaticamente il totem all'avvio di Windows
REM 
REM INSTALLAZIONE:
REM 1. Modifica il percorso SERVER_URL con l'URL corretto
REM 2. Copia questo file in: C:\Users\[Username]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
REM 3. Oppure crea un task scheduler per esecuzione all'avvio

echo.
echo ========================================
echo   MAVI PUZZLE - TOTEM MODE
echo ========================================
echo.

REM Configurazione
SET SERVER_URL=http://localhost:3000
SET CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
SET EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

REM Verifica se Chrome è installato
if exist %CHROME_PATH% (
    echo [INFO] Utilizzo Google Chrome...
    SET BROWSER_PATH=%CHROME_PATH%
    goto :start_browser
)

REM Altrimenti usa Edge
if exist %EDGE_PATH% (
    echo [INFO] Utilizzo Microsoft Edge...
    SET BROWSER_PATH=%EDGE_PATH%
    goto :start_browser
)

REM Nessun browser trovato
echo [ERRORE] Nessun browser compatibile trovato!
echo Installa Google Chrome o Microsoft Edge.
pause
exit /b 1

:start_browser
echo [INFO] Avvio browser in modalita kiosk...
echo [INFO] URL: %SERVER_URL%
echo.

REM Avvia il browser in modalità kiosk (fullscreen senza UI)
start "" %BROWSER_PATH% ^
    --kiosk ^
    --kiosk-printing ^
    --no-first-run ^
    --disable-infobars ^
    --disable-session-crashed-bubble ^
    --disable-restore-session-state ^
    --autoplay-policy=no-user-gesture-required ^
    --start-maximized ^
    %SERVER_URL%

echo [OK] Totem avviato con successo!
echo [INFO] Premi F11 per uscire dalla modalita fullscreen
echo.

REM Attendi 5 secondi prima di chiudere la finestra
timeout /t 5 /nobreak >nul

exit /b 0
