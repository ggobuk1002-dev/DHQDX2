@echo off
chcp 65001 > nul
echo ===================================================
echo [금동대향로 자연사박물관] 로컬 가상웹전시 서버를 실행합니다...
echo 브라우저에서 http://localhost:8080 주소로 자동 접속됩니다.
echo (종료하시려면 이 창을 닫으세요.)
echo ===================================================
start "" "http://localhost:8080"
python -m http.server 8080
pause
