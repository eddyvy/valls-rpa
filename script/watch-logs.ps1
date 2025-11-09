# Script para monitorear logs de actualizaciones en tiempo real
# Ejecutar con: .\script\watch-logs.ps1

$logPath = Join-Path $env:APPDATA "valls-rpa\logs\main.log"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Monitoreo de Logs - Valls RPA" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ubicación del log: $logPath" -ForegroundColor Yellow
Write-Host ""

if (Test-Path $logPath) {
    Write-Host "Mostrando últimas 20 líneas y monitoreando nuevos logs..." -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para salir" -ForegroundColor Gray
    Write-Host ""
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    
    # Mostrar últimas líneas
    Get-Content $logPath -Tail 20
    
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Esperando nuevos logs..." -ForegroundColor Yellow
    Write-Host ""
    
    # Monitorear nuevos logs
    Get-Content $logPath -Wait -Tail 0
} else {
    Write-Host "⚠️  El archivo de log no existe aún." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Posibles razones:" -ForegroundColor White
    Write-Host "  1. La aplicación nunca se ha ejecutado en modo producción" -ForegroundColor Gray
    Write-Host "  2. La aplicación está en modo desarrollo (npm start)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para generar logs:" -ForegroundColor White
    Write-Host "  1. Ejecuta: npm run build:win" -ForegroundColor Cyan
    Write-Host "  2. Instala el .exe generado en release/" -ForegroundColor Cyan
    Write-Host "  3. Ejecuta la aplicación instalada" -ForegroundColor Cyan
    Write-Host "  4. Vuelve a ejecutar este script" -ForegroundColor Cyan
}
