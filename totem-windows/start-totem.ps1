# ==============================================
# MAVI PUZZLE - TOTEM STARTUP SCRIPT (PowerShell)
# ==============================================
# Script PowerShell per avvio totem con più opzioni di configurazione
#
# ESECUZIONE:
# PowerShell -ExecutionPolicy Bypass -File start-totem.ps1
#
# INSTALLAZIONE AUTOSTART:
# 1. Crea un collegamento a questo script
# 2. Copia il collegamento in: shell:startup (esegui questo comando in Win+R)

param(
    [string]$ServerUrl = "http://localhost:3000",
    [string]$BrowserType = "auto",  # auto, chrome, edge, firefox
    [switch]$DisableGPU = $false,
    [switch]$ClearCache = $false
)

Write-Host ""
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "  MAVI PUZZLE - TOTEM MODE"  -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurazione browser paths
$browsers = @{
    chrome = @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "$env:ProgramFiles (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
    )
    edge = @(
        "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe",
        "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
    )
    firefox = @(
        "$env:ProgramFiles\Mozilla Firefox\firefox.exe",
        "$env:ProgramFiles (x86)\Mozilla Firefox\firefox.exe"
    )
}

# Funzione per trovare browser
function Find-Browser {
    param([string]$type)
    
    foreach ($path in $browsers[$type]) {
        if (Test-Path $path) {
            return $path
        }
    }
    return $null
}

# Determina quale browser usare
$browserPath = $null
$browserName = ""

if ($BrowserType -eq "auto") {
    # Prova Chrome prima
    $browserPath = Find-Browser "chrome"
    $browserName = "Chrome"
    
    # Se non trovato, prova Edge
    if (-not $browserPath) {
        $browserPath = Find-Browser "edge"
        $browserName = "Edge"
    }
    
    # Altrimenti Firefox
    if (-not $browserPath) {
        $browserPath = Find-Browser "firefox"
        $browserName = "Firefox"
    }
} else {
    $browserPath = Find-Browser $BrowserType
    $browserName = $BrowserType
}

# Verifica se browser trovato
if (-not $browserPath) {
    Write-Host "[ERRORE] Nessun browser compatibile trovato!" -ForegroundColor Red
    Write-Host "Installa Google Chrome, Microsoft Edge o Firefox." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Premi Enter per uscire"
    exit 1
}

Write-Host "[INFO] Browser selezionato: $browserName" -ForegroundColor Green
Write-Host "[INFO] Percorso: $browserPath" -ForegroundColor Gray
Write-Host "[INFO] URL: $ServerUrl" -ForegroundColor Green
Write-Host ""

# Costruisci argomenti per il browser
$args = @(
    "--kiosk"
    "--start-maximized"
    "--no-first-run"
    "--disable-infobars"
    "--disable-session-crashed-bubble"
    "--disable-restore-session-state"
    "--autoplay-policy=no-user-gesture-required"
    "--disable-features=TranslateUI"
    "--disable-popup-blocking"
    $ServerUrl
)

# Aggiungi opzioni avanzate
if ($DisableGPU) {
    $args += "--disable-gpu"
    Write-Host "[INFO] GPU acceleration disabilitata" -ForegroundColor Yellow
}

if ($ClearCache) {
    $args += "--disk-cache-size=1"
    Write-Host "[INFO] Cache disabilitata" -ForegroundColor Yellow
}

# Firefox ha argomenti diversi
if ($browserName -eq "Firefox") {
    $args = @(
        "-kiosk"
        $ServerUrl
    )
}

Write-Host "[INFO] Avvio browser in modalita kiosk..." -ForegroundColor Cyan
Write-Host ""

# Avvia il browser
try {
    Start-Process -FilePath $browserPath -ArgumentList $args
    Write-Host "[OK] Totem avviato con successo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "COMANDI UTILI:" -ForegroundColor Yellow
    Write-Host "  F11          - Esci dalla modalita fullscreen" -ForegroundColor Gray
    Write-Host "  Alt+F4       - Chiudi il browser" -ForegroundColor Gray
    Write-Host "  Ctrl+W       - Chiudi tab" -ForegroundColor Gray
    Write-Host ""
    
    # Attendi qualche secondo
    Start-Sleep -Seconds 3
} catch {
    Write-Host "[ERRORE] Impossibile avviare il browser!" -ForegroundColor Red
    Write-Host "Dettagli errore: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Premi Enter per uscire"
    exit 1
}

exit 0
