$aircrafts = Get-Content "public/aircrafts.json" | ConvertFrom-Json
$baseUrl = "https://samples.adsbexchange.com/traces"
$from = Get-Date -Year 2016 -Month 7 -Day 1
$now = Get-Date
$adsbDataDir = "public/adsb"

foreach ($aircraft in $aircrafts) {
  $icao = $aircraft.icao.ToLower()
  $date = $from
  while ($date -lt $now) {
    $y = $date.Year
    $m = ([string]$date.Month).PadLeft(2, "0")
    $d = "01"
    $downloadUrl = "$baseUrl/$y/$m/$d/$($icao.Substring(4))/trace_full_$icao.json"
    $outFile = "$adsbDataDir/$y$m$d-$icao-trace.json"
    try {
      Invoke-WebRequest -Uri $downloadUrl -OutFile "$outFile" -Resume
      Write-Host "Downloaded: $outFile"
    }
    catch {
      # If 404 occurs, there is no data, so ignore the error
    }
    $date = $date.AddMonths(1)
  }
}

$jsonFiles = Get-Item public/adsb/*-trace.json

$traces = [System.Collections.ArrayList]@()
foreach ($jsonFile in $jsonFiles) {
  $trace = Get-Content $jsonFile | ConvertFrom-Json
  $traces.Add($trace)
}

$exportFile = "public/adsb/sample-traces.json"
$traces | ConvertTo-Json -Depth 5 -Compress | Out-File -FilePath $exportFile
Write-Host "Exported traces to: $exportFile"
