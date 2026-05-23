$baseUrl = "http://localhost:8080/api/v1"

# 1. Login to get token
Write-Host "Logging in as admin..."
$loginBody = @{
    email = "admin_final@devflow.com"
    senha = "Admin@2026"
} | ConvertTo-Json

try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    Write-Host "Login successful. Token acquired."
} catch {
    Write-Error "Login failed: $_"
    exit
}

# 2. Request PDF closeout report
Write-Host "Requesting PDF for project 1..."
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/projetos/1/financeiro/closeout/pdf" -Headers $headers -Method Get
    Write-Host "Success! Response code: $($response.StatusCode)"
} catch {
    Write-Host "Error occurred! Status code: $($_.Exception.Response.StatusCode.value__)"
    $streamReader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $streamReader.ReadToEnd()
    Write-Host "Error details:"
    Write-Host $errBody
}
