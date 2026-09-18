# Guide d'Installation Locale : BRALIMA-VIE (`bralimavie`)

Ce guide vous permet d'installer et d'exécuter l'intégralité du projet **bralimavie** directement sur votre **Bureau**.

---

## 📥 Étape 1 : Télécharger le projet sur votre Bureau

Comme notre environnement s'exécute dans un conteneur Cloud sécurisé (Google AI Studio), vous pouvez exporter le code source sur votre ordinateur en 1 clic :

1. Cliquez sur l'icône **Paramètres / Menu** (ou **Export / Partager**) en haut à droite de l'écran Google AI Studio.
2. Choisissez **Download ZIP** (ou **Export to GitHub**).
3. Décompressez l'archive téléchargée directement sur votre Bureau sous le nom :
   ```bash
   # Sur Windows :
   C:\Users\VotreNom\Desktop\bralimavie

   # Sur Mac / Linux :
   ~/Desktop/bralimavie
   ```

---

## 🏗️ Structure du Dossier `bralimavie`

Une fois extrait sur votre Bureau, voici l'arborescence recommandée pour vos 4 technologies :

```text
bralimavie/
│
├── apps/
│   ├── mobile_flutter/          # 📱 Application mobile agents de terrain & chauffeurs
│   │   ├── lib/
│   │   │   ├── main.dart
│   │   │   ├── core/services/sync_service.dart
│   │   │   └── screens/
│   │   └── pubspec.yaml
│   │
│   ├── backend_nest/            # ⚙️ Cœur métier, API Gateway, Auth RBAC & WebSockets
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── orders/
│   │   │   └── inventory/
│   │   └── package.json
│   │
│   ├── ai_python/               # 🧠 Microservice Python (FastAPI, VRP & Gemini)
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── models/
│   │
│   └── web_dashboard/           # 💻 Dashboard de supervision BRALIMA (Web/Nuxt/React)
│       ├── src/
│       └── package.json
│
├── docker-compose.yml           # 🐳 Orchestration locale complète (Postgres, Redis, APIs)
└── README.md
```

---

## 🚀 Étape 2 : Démarrage Rapide

### Option A : Lancer le projet Web immédiatement
Ouvrez un terminal dans le dossier `bralimavie` :
```bash
cd ~/Desktop/bralimavie
npm install
npm run dev
```
L'application web sera accessible sur `http://localhost:3000`.

### Option B : Lancer l'écosystème avec Docker (Postgres + Redis + Backend)
```bash
cd ~/Desktop/bralimavie
docker-compose up -d
```

### Option C : Lancer l'application Mobile Flutter
```bash
cd ~/Desktop/bralimavie/apps/mobile_flutter
flutter pub get
flutter run
```

---

## 🔑 Variables d'Environnement (.env)
Créez un fichier `.env` à la racine de `bralimavie` :
```env
PORT=3000
DATABASE_URL=postgres://postgres:secret@localhost:5432/bralima_db
GEMINI_API_KEY=votre_cle_api_gemini
```
