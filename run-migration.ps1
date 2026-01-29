# Script chạy Migration Database cho Supermarket Project
# Sử dụng: .\run-migration.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Supermarket Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra MySQL có cài đặt chưa
$mysqlCheck = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCheck) {
    Write-Host "❌ MySQL không được tìm thấy trong PATH!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt MySQL hoặc thêm MySQL vào PATH environment variable." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MySQL đã được cài đặt" -ForegroundColor Green
Write-Host ""

# Đường dẫn file migration
$migrationFile = "src/main/resources/database/migration.sql"
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Không tìm thấy file migration: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 File migration: $migrationFile" -ForegroundColor Green
Write-Host ""

# Nhập thông tin MySQL
$mysqlUser = Read-Host "Nhập MySQL username (mặc định: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Nhập MySQL password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

Write-Host ""
Write-Host "🔄 Đang chạy migration..." -ForegroundColor Yellow

# Chạy migration
try {
    Get-Content $migrationFile | mysql -u $mysqlUser -p$plainPassword 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migration thành công!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Bạn có thể:" -ForegroundColor Cyan
        Write-Host "  1. Restart Spring Boot application" -ForegroundColor White
        Write-Host "  2. Test API trên Postman" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Migration thất bại! Vui lòng kiểm tra lỗi ở trên." -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Lỗi khi chạy migration: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
