@echo off
REM Script de configuration automatique pour le dossier bralimavie sur le Bureau Windows
echo ==========================================================
echo  Initialisation du projet BRALIMAVIE sur votre Bureau
echo  Stack: Flutter + NestJS/Node + Python + Web/Nuxt
echo ==========================================================

set TARGET_DIR=%USERPROFILE%\Desktop\bralimavie

echo 1. Creation des dossiers dans : %TARGET_DIR%
mkdir "%TARGET_DIR%\apps\mobile_flutter" 2>nul
mkdir "%TARGET_DIR%\apps\backend_nest" 2>nul
mkdir "%TARGET_DIR%\apps\ai_python" 2>nul
mkdir "%TARGET_DIR%\apps\web_dashboard" 2>nul

echo 2. Structure creee avec succes.
echo Votre projet est pret dans : %TARGET_DIR%
pause
