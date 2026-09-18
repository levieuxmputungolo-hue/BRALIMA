import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BRALIMA DDC API Gateway (Node.js/NestJS)',
      stack: {
        mobile: 'Flutter (Dart)',
        backend: 'Node.js / NestJS',
        ai_engine: 'Python (FastAPI + Gemini)',
        web: 'Nuxt.js / React DDC Command Center'
      },
      timestamp: new Date().toISOString()
    });
  });

  // Mobile Sync Endpoint for Flutter (Offline-First sync)
  app.post('/api/mobile/sync', (req, res) => {
    const { deviceId, agentId, lastSyncTimestamp, pendingOrders = [], offlineAudits = [] } = req.body;
    
    // Simulate processing offline orders created in Kinshasa/Lubumbashi zones
    const processedOrders = pendingOrders.map((order: any) => ({
      localId: order.localId || 'local-temp',
      serverOrderId: `CMD-SYNC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Validée',
      syncStatus: 'synced',
      confirmedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      syncTimestamp: new Date().toISOString(),
      agentId: agentId || 'AGENT-RTM-001',
      deviceId: deviceId || 'FLUTTER-DEVICE-DEFAULT',
      ordersSyncedCount: pendingOrders.length,
      auditsSyncedCount: offlineAudits.length,
      processedOrders,
      serverMessage: 'Synchronisation bidirectionnelle réussie avec le Hub BRALIMA Limete.'
    });
  });

  // Python Microservice Bridge: VRP Route & Fleet Optimization
  app.post('/api/python/optimize-vrp', (req, res) => {
    const { region = 'Kinshasa', truckCapacityCasiers = 800, deliveryStops = [] } = req.body;

    // Simulation of Python (FastAPI + SciPy/OR-Tools) Vehicle Routing Problem solution
    const defaultStops = deliveryStops.length > 0 ? deliveryStops : [
      { name: 'Terrasse Chez Ntemba (Bandalungwa)', casiers: 120, lat: -4.331, lng: 15.285 },
      { name: 'Nganda La Joie (Kalamu / Matonge)', casiers: 180, lat: -4.342, lng: 15.312 },
      { name: 'Dépôt Relais Kintambo Magasin', casiers: 300, lat: -4.321, lng: 15.267 },
      { name: 'Bar Moderne VIP (Gombe)', casiers: 90, lat: -4.305, lng: 15.301 }
    ];

    const totalCasiers = defaultStops.reduce((sum: number, s: any) => sum + (s.casiers || 0), 0);
    const estimatedDistanceKm = region === 'Kinshasa' ? 34.2 : 68.5;
    const estimatedFuelLiters = Math.round(estimatedDistanceKm * 0.35);
    const estimatedDurationMinutes = Math.round(estimatedDistanceKm * 3.8); // Kinshasa traffic factor

    res.json({
      engine: 'Python FastAPI (OR-Tools VRP Solver v2.4)',
      region,
      truckCapacityCasiers,
      totalCasiersToDeliver: totalCasiers,
      capacityUtilizationRate: `${Math.round((totalCasiers / truckCapacityCasiers) * 100)}%`,
      metrics: {
        distanceKm: estimatedDistanceKm,
        fuelLiters: estimatedFuelLiters,
        estimatedTimeMinutes: estimatedDurationMinutes,
        trafficCongestionIndex: 'Modéré (Éviter Rond-Point Victoire entre 16h30 et 19h00)'
      },
      optimizedSequence: defaultStops.map((stop: any, idx: number) => ({
        step: idx + 1,
        stopName: stop.name,
        casiers: stop.casiers,
        recommendedEta: `T+${(idx + 1) * 35} min`
      }))
    });
  });

  // Python Microservice Bridge: Weekend Demand Forecast by Commune
  app.post('/api/python/forecast-demand', (req, res) => {
    const { region = 'Kinshasa', product = 'Primus 50cl', weather = 'Chaud 32°C' } = req.body;

    res.json({
      engine: 'Python Data Science (Pandas + Prophet + Gemini)',
      region,
      product,
      predictedWeekendPeakHectolitres: 4850,
      predictedCasiers: 40416,
      peakDay: 'Samedi soir (18h00 - 02h00)',
      communeBreakdown: [
        { commune: 'Bandalungwa', forecastCasiers: 9400, trend: '+14% vs N-1' },
        { commune: 'Kalamu / Matonge', forecastCasiers: 8600, trend: '+18% vs N-1' },
        { commune: 'Lemba (Terminus & Super)', forecastCasiers: 7200, trend: '+9% vs N-1' },
        { commune: 'Gombe (Lounge & Hôtels)', forecastCasiers: 5800, trend: '+12% vs N-1' },
        { commune: 'Ngaliema / Kintambo', forecastCasiers: 9416, trend: '+11% vs N-1' }
      ],
      recommendation: 'Pré-positionner 12 camions de réassort vendredi à 14h00 pour éviter la saturation du pont Matete et du boulevard Triomphal.'
    });
  });

  // Architecture OpenAPI / Swagger Specification Endpoint
  app.get('/api/architecture/spec', (req, res) => {
    res.json({
      title: 'BRALIMA Digital Distribution Command Center (DDC) API',
      version: '3.2.0',
      stack: {
        mobile: {
          framework: 'Flutter 3.x (Dart)',
          purpose: 'Prise de commande RTM, audit frigos, GPS, bon de livraison électronique (POD)',
          persistence: 'Isar / SQLite (Offline-First)',
          syncMethod: 'REST over HTTP/2 & WebSocket'
        },
        backend: {
          framework: 'Node.js / NestJS',
          purpose: 'API Gateway, RBAC, WebSockets temps-réel, intégration SAP/Dynamics ERP',
          database: 'PostgreSQL + Redis Cache'
        },
        ai_engine: {
          framework: 'Python 3.11 (FastAPI + OR-Tools + Gemini)',
          purpose: 'Moteur de tournée VRP, prédiction des ventes week-end, détection des avaries',
          queue: 'Celery / Redis'
        },
        frontend: {
          framework: 'Nuxt.js 3 / Next.js / React Vite',
          purpose: 'Supervision centrale 24/7 des dépôts, stocks et logistique RDC'
        }
      },
      endpoints: [
        { method: 'GET', path: '/api/health', description: 'État de santé du cluster' },
        { method: 'POST', path: '/api/mobile/sync', description: 'Synchronisation montante et descendante Flutter (Offline)' },
        { method: 'POST', path: '/api/python/optimize-vrp', description: 'Calcul de tournée optimale camions / barges' },
        { method: 'POST', path: '/api/python/forecast-demand', description: 'Prévision de la demande par commune' },
        { method: 'POST', path: '/api/ai/analyze', description: 'Analyse stratégique Gemini LLM' }
      ]
    });
  });

  // AI Analysis Endpoint for BRALIMA DDC
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { prompt, context, type } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High quality fallback analysis when API key is not configured
        const fallbackAnalysis = generateFallbackInsights(type, prompt, context);
        return res.json({
          analysis: fallbackAnalysis,
          source: 'local_engine',
          model: 'BRALIMA Logistics Rule Engine v4.2'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Tu es l'assistant IA exécutif du Command Center de Distribution BRALIMA en RDC (République Démocratique du Congo).
BRALIMA produit et distribue des marques emblématiques : Primus, Castel Beer, Turbo King, Muttzig, Legend, Vitalo, Fayrouz, Maltina, etc.
Tu analyses les données de distribution à travers les pôles majeurs : Kinshasa, Lubumbashi, Goma, Kananga, Kisangani, Matadi / Boma.
Sois précis, professionnel, axé sur les opérations de brasserie, la chaîne logistique fluviale (fleuve Congo, barges) et routière (RN1), les ratios de casiers/hectolitres, et formule des recommandations concrètes et immédiatement actionnables pour la Direction Commerciale et Logistique.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nContexte actuel : ${JSON.stringify(context || {})}\n\nType d'analyse : ${type || 'general'}\n\nQuestion ou demande : ${prompt || 'Fournir un diagnostic complet de la distribution avec recommandations.'}`
              }
            ]
          }
        ],
        config: {
          temperature: 0.3,
          maxOutputTokens: 1200
        }
      });

      const text = response.text || 'Analyse non disponible.';
      res.json({
        analysis: text,
        source: 'gemini',
        model: 'gemini-3.8-flash'
      });
    } catch (error: any) {
      console.error('Error generating AI analysis:', error);
      const fallbackAnalysis = generateFallbackInsights(req.body.type, req.body.prompt, req.body.context);
      res.json({
        analysis: fallbackAnalysis,
        source: 'local_engine_fallback',
        error: error.message
      });
    }
  });

  function generateFallbackInsights(type: string, prompt: string, context: any) {
    const region = context?.region || 'National';
    return `### ✦ Diagnostic IA Prédictif BRALIMA — ${region}

**1. Analyse des Tensions de Stock & Flux:**
- **Primus 50cl & 33cl :** Forte vélocité observée en périphérie (${region === 'Kinshasa' ? 'Tshangu et Ngaliema' : 'zones à haute densité'}). Le taux de rotation des casiers est supérieur de +18% aux prévisions hebdomadaires.
- **Risque d'épuisement :** Le dépôt central risque la rupture sous 36 heures si le réapprovisionnement par navettes n'est pas priorisé.

**2. Optimisation Flotte & RTM (Route-to-Market):**
- Les délais de déchargement au niveau des grossistes secondaires accusent un retard moyen de 42 minutes.
- Recommandation : Activer le plan de délestage via les 3 mini-hubs relais et reprogrammer les tournées des camions 10 tonnes dès 05h30 pour contourner les congestions urbaines.

**3. Opportunités Commerciales & Points de Vente:**
- Taux d'adhésion aux promotions *Castel Beer* en hausse de +14% sur les terrasses et débits de boisson partenaires.
- Réallouer 1 200 casiers supplémentaires vers les points de vente à forte rotation avant le pic de consommation du week-end.`;
  }

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BRALIMA DDC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
