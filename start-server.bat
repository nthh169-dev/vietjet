@echo off
chcp 65001 >nul
echo ============================================================
echo   VIETJET TRAVEL WEBSITE - LOCAL WEB SERVER (PORT 8080)
echo   Server giup trinh duyet doc truc tiep sqlite/vietjet.db!
echo ============================================================
start "" "http://localhost:8080/index.html"
python -m http.server 8080
