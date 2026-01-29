# Script chạy Seed Data cho Supermarket Project
# Sử dụng: .\run-seed-data.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Supermarket Database Seed Data" -ForegroundColor Cyan
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

# Đường dẫn file seed data
$seedFile = "src/main/resources/database/seed_data.sql"
if (-not (Test-Path $seedFile)) {
    Write-Host "❌ Không tìm thấy file seed data: $seedFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 File seed data: $seedFile" -ForegroundColor Green
Write-Host "⚠️  Cảnh báo: Script này sẽ thêm dữ liệu mẫu vào database 'supermarket'" -ForegroundColor Yellow
Write-Host ""

# Nhập thông tin MySQL
$mysqlUser = Read-Host "Nhập MySQL username (mặc định: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Nhập MySQL password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

Write-Host ""
Write-Host "🔄 Đang chạy seed data..." -ForegroundColor Yellow

# Chạy seed data
try {
    Get-Content $seedFile | mysql -u $mysqlUser -p$plainPassword supermarket 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Seed data thành công!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Lưu ý: Password trong seed data là placeholder, không thể dùng để login." -ForegroundColor Yellow
        Write-Host "   Vui lòng tạo user mới qua API POST /users để test login." -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "❌ Seed data thất bại! Vui lòng kiểm tra lỗi ở trên." -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Lỗi khi chạy seed data: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
