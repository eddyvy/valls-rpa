# Script para publicar releases que están en draft
# Ejecutar con: .\script\publish-releases.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Publicar Releases en Draft - Valls RPA" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$repo = "eddyvy/valls-rpa"

# Verificar que gh CLI está instalado
$ghPath = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghPath) {
    Write-Host "ERROR: GitHub CLI no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instálalo con:" -ForegroundColor Yellow
    Write-Host "  winget install GitHub.cli" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Luego ejecuta:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor Cyan
    exit 1
}

# Verificar autenticación
Write-Host "Verificando autenticación..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No estás autenticado con GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ejecuta primero:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "OK - Autenticado correctamente" -ForegroundColor Green
Write-Host ""

# Obtener releases en draft
Write-Host "Buscando releases en draft..." -ForegroundColor Yellow
$releases = gh release list --repo $repo --json tagName,name,isDraft,isPrerelease | ConvertFrom-Json

$draftReleases = $releases | Where-Object { $_.isDraft -eq $true }

if ($draftReleases.Count -eq 0) {
    Write-Host "No se encontraron releases en draft" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Releases disponibles:" -ForegroundColor White
    $releases | ForEach-Object {
        $status = @()
        if ($_.isDraft) { $status += "DRAFT" }
        if ($_.isPrerelease) { $status += "PRERELEASE" }
        $statusText = if ($status.Count -gt 0) { " [$($status -join ', ')]" } else { " [PUBLISHED]" }
        Write-Host "  - $($_.tagName): $($_.name)$statusText" -ForegroundColor Gray
    }
    exit 0
}

Write-Host "Encontrados $($draftReleases.Count) release(s) en draft:" -ForegroundColor Green
$draftReleases | ForEach-Object {
    Write-Host "  - $($_.tagName): $($_.name)" -ForegroundColor Cyan
}
Write-Host ""

# Preguntar si publicar todos o uno específico
if ($draftReleases.Count -eq 1) {
    $tag = $draftReleases[0].tagName
    $name = $draftReleases[0].name
    
    $confirm = Read-Host "Publicar release '$name' ($tag)? [S/n]"
    if ($confirm -eq "" -or $confirm -eq "S" -or $confirm -eq "s" -or $confirm -eq "Y" -or $confirm -eq "y") {
        Write-Host ""
        Write-Host "Publicando $tag..." -ForegroundColor Yellow
        
        gh release edit $tag --repo $repo --draft=false
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK - Release publicado correctamente" -ForegroundColor Green
            Write-Host ""
            Write-Host "URL: https://github.com/$repo/releases/tag/$tag" -ForegroundColor Cyan
        } else {
            Write-Host "ERROR al publicar el release" -ForegroundColor Red
        }
    } else {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
    }
} else {
    Write-Host "Opciones:" -ForegroundColor White
    Write-Host "  1. Publicar TODOS los releases en draft" -ForegroundColor Cyan
    Write-Host "  2. Seleccionar uno específico" -ForegroundColor Cyan
    Write-Host "  3. Cancelar" -ForegroundColor Gray
    Write-Host ""
    
    $option = Read-Host "Selecciona una opción [1-3]"
    
    if ($option -eq "1") {
        Write-Host ""
        foreach ($release in $draftReleases) {
            $tag = $release.tagName
            Write-Host "Publicando $tag..." -ForegroundColor Yellow
            
            gh release edit $tag --repo $repo --draft=false
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  OK" -ForegroundColor Green
            } else {
                Write-Host "  ERROR" -ForegroundColor Red
            }
        }
        Write-Host ""
        Write-Host "Proceso completado" -ForegroundColor Green
        
    } elseif ($option -eq "2") {
        Write-Host ""
        Write-Host "Releases disponibles:" -ForegroundColor White
        for ($i = 0; $i -lt $draftReleases.Count; $i++) {
            Write-Host "  $($i + 1). $($draftReleases[$i].tagName): $($draftReleases[$i].name)" -ForegroundColor Cyan
        }
        Write-Host ""
        
        $selection = Read-Host "Selecciona el número del release a publicar [1-$($draftReleases.Count)]"
        $index = [int]$selection - 1
        
        if ($index -ge 0 -and $index -lt $draftReleases.Count) {
            $release = $draftReleases[$index]
            $tag = $release.tagName
            
            Write-Host ""
            Write-Host "Publicando $tag..." -ForegroundColor Yellow
            
            gh release edit $tag --repo $repo --draft=false
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK - Release publicado correctamente" -ForegroundColor Green
                Write-Host ""
                Write-Host "URL: https://github.com/$repo/releases/tag/$tag" -ForegroundColor Cyan
            } else {
                Write-Host "ERROR al publicar el release" -ForegroundColor Red
            }
        } else {
            Write-Host "Selección inválida" -ForegroundColor Red
        }
        
    } else {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
