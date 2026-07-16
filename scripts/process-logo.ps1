param(
  [string]$Src = "C:\Users\SenetUser\.cursor\projects\c-Users-SenetUser-sport-king\assets\c__Users_SenetUser_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_oie_transparent__1_-fc76bb3d-6dfb-4642-8c0e-96e6ed3f176f.png",
  [string]$OutDir = "C:\Users\SenetUser\sport-king\public\logo",
  [int]$Threshold = 35
)

Add-Type -AssemblyName System.Drawing

function Get-Luminance([System.Drawing.Color]$p) {
  return [int](0.299 * $p.R + 0.587 * $p.G + 0.114 * $p.B)
}

function Export-Logo([string]$mode, [string]$outPath) {
  $srcBmp = [System.Drawing.Bitmap]::FromFile($Src)
  $w = $srcBmp.Width
  $h = $srcBmp.Height

  $minX = $w
  $minY = $h
  $maxX = 0
  $maxY = 0

  for ($x = 0; $x -lt $w; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
      $lum = Get-Luminance ($srcBmp.GetPixel($x, $y))
      if ($lum -ge $Threshold) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  $cw = $maxX - $minX + 1
  $ch = $maxY - $minY + 1
  $outBmp = New-Object System.Drawing.Bitmap $cw, $ch, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  for ($x = 0; $x -lt $cw; $x++) {
    for ($y = 0; $y -lt $ch; $y++) {
      $sx = $minX + $x
      $sy = $minY + $y
      $lum = Get-Luminance ($srcBmp.GetPixel($sx, $sy))
      if ($lum -ge $Threshold) {
        $alpha = [Math]::Min(255, [Math]::Max(80, ($lum - $Threshold + 40) * 3))
        if ($mode -eq 'dark') {
          $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 17, 19, 19))
        } else {
          $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
        }
      } else {
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      }
    }
  }

  $srcBmp.Dispose()
  $outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $outBmp.Dispose()
  Write-Host "Saved $outPath (${cw}x${ch})"
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
Export-Logo 'dark' (Join-Path $OutDir 'sportking-logo.png')
Export-Logo 'light' (Join-Path $OutDir 'sportking-logo-light.png')
