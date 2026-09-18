#!/bin/bash
# Script de configuration automatique pour le dossier bralimavie sur le Bureau
echo "=========================================================="
echo " Initialisation du projet BRALIMAVIE sur le Bureau        "
echo " Stack: Flutter + NestJS/Node + Python + Web/Nuxt         "
echo "=========================================================="

TARGET_DIR="$HOME/Desktop/bralimavie"

echo "1. Création de l'arborescence dans : $TARGET_DIR"
mkdir -p "$TARGET_DIR/apps/mobile_flutter"
mkdir -p "$TARGET_DIR/apps/backend_nest"
mkdir -p "$TARGET_DIR/apps/ai_python"
mkdir -p "$TARGET_DIR/apps/web_dashboard"

echo "2. Copie des fichiers sources..."
cp -r ./* "$TARGET_DIR/apps/web_dashboard/" 2>/dev/null || true

echo "3. Terminé avec succès !"
echo "Votre projet est prêt dans : $TARGET_DIR"
