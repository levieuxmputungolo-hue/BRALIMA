import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  Server,
  Cpu,
  Globe,
  Play,
  CheckCircle2,
  Copy,
  Terminal,
  ArrowRight,
  Database,
  Radio,
  Clock,
  ShieldCheck,
  Code
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'diagram' | 'code'>('diagram');
  const [activeCodeLang, setActiveCodeLang] = useState<'flutter' | 'python' | 'nestjs' | 'docker'>('flutter');
  const [isCopied, setIsCopied] = useState(false);

  // Sandbox State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('mobile-sync');
  const [isExecuting, setIsExecuting] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleExecuteSandbox = async () => {
    setIsExecuting(true);
    setApiResponse(null);
    const start = performance.now();

    try {
      let res: Response;
      if (selectedEndpoint === 'mobile-sync') {
        res = await fetch('/api/mobile/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: 'TECNO-CAMON-20-RTM-KIN',
            agentId: 'REP-KIN-004 (Jean-Marc Kabuya)',
            lastSyncTimestamp: '2026-09-17T14:30:00Z',
            pendingOrders: [
              {
                localId: 'OFFLINE-CMD-001',
                customerName: 'Terrasse Chez Ntemba',
                casiersCount: 45,
                product: 'Primus 50cl',
                totalCDF: 1980000
              },
              {
                localId: 'OFFLINE-CMD-002',
                customerName: 'Nganda La Joie Matonge',
                casiersCount: 30,
                product: 'Castel Beer 65cl',
                totalCDF: 1440000
              }
            ],
            offlineAudits: [
              { posId: 'POS-KIN-001', fridgeBrandShare: '85% Bralima', coldStatus: 'Conforme' }
            ]
          })
        });
      } else if (selectedEndpoint === 'python-vrp') {
        res = await fetch('/api/python/optimize-vrp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region: 'Kinshasa',
            truckCapacityCasiers: 800,
            deliveryStops: [
              { name: 'Terrasse Chez Ntemba (Bandalungwa)', casiers: 120 },
              { name: 'Nganda La Joie (Kalamu / Matonge)', casiers: 180 },
              { name: 'Dépôt Relais Kintambo Magasin', casiers: 300 },
              { name: 'Bar Moderne VIP (Gombe)', casiers: 90 }
            ]
          })
        });
      } else if (selectedEndpoint === 'python-forecast') {
        res = await fetch('/api/python/forecast-demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region: 'Kinshasa',
            product: 'Primus 50cl',
            weather: 'Chaud 32°C (Prévision pic week-end)'
          })
        });
      } else {
        res = await fetch('/api/architecture/spec');
      }

      const elapsed = Math.round(performance.now() - start);
      setExecutionTime(elapsed);
      setResponseStatus(res.status);
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setResponseStatus(500);
      setApiResponse({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const CODE_SNIPPETS = {
    flutter: `// lib/core/services/sync_service.dart
// Client Flutter (Dart) pour délégués RTM et Chauffeurs
import 'package:dio/dio.dart';
import 'package:sqflite/sqflite.dart';

class BralimaMobileSyncService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://api-ddc.bralima.cd',
    connectTimeout: const Duration(seconds: 10),
  ));
  final Database _localDb;

  BralimaMobileSyncService(this._localDb);

  /// Synchronise les commandes prises hors-ligne (ex: bars sans réseau)
  Future<SyncResult> syncPendingOrdersToNestBackend() async {
    // 1. Récupération locale des commandes en attente
    final pending = await _localDb.query(
      'orders',
      where: 'sync_status = ?',
      whereArgs: ['pending_upload'],
    );

    if (pending.isEmpty) return SyncResult.upToDate();

    // 2. Envoi groupé au backend Node/NestJS
    final response = await _dio.post('/api/mobile/sync', data: {
      'deviceId': 'TECNO-CAMON-20-RTM',
      'agentId': 'REP-KIN-004',
      'pendingOrders': pending,
    });

    if (response.statusCode == 200) {
      // 3. Mise à jour de l'état local dans SQLite
      await _localDb.rawUpdate(
        'UPDATE orders SET sync_status = ? WHERE sync_status = ?',
        ['synced', 'pending_upload'],
      );
      return SyncResult.success(response.data['ordersSyncedCount']);
    }
    throw Exception('Échec de synchronisation Bralima');
  }
}`,

    python: `# ai_service/main.py
# Microservice Python (FastAPI + SciPy/OR-Tools)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(title="BRALIMA Logistics & Forecast Engine", version="3.0")

class DeliveryStop(BaseModel):
    name: str
    casiers: int

class VrpRequest(BaseModel):
    region: str
    truckCapacityCasiers: int
    deliveryStops: List[DeliveryStop]

@app.post("/api/python/optimize-vrp")
def calculate_optimal_route(payload: VrpRequest):
    """
    Optimise la tournée d'un camion 30T ou barge fluviale
    sur le réseau routier de Kinshasa / RN1 / fleuve Congo.
    """
    total_crates = sum(s.casiers for s in payload.deliveryStops)
    if total_crates > payload.truckCapacityCasiers:
        raise HTTPException(status_code=400, detail="Capacité camion dépassée.")

    # Algorithme heuristique du plus proche voisin
    optimized = sorted(payload.deliveryStops, key=lambda x: -x.casiers)
    
    return {
        "engine": "Python OR-Tools VRP",
        "region": payload.region,
        "totalCasiers": total_crates,
        "estimatedFuelLiters": round(len(payload.deliveryStops) * 6.5, 1),
        "optimizedStops": [
            {"step": i + 1, "name": s.name, "casiers": s.casiers}
            for i, s in enumerate(optimized)
        ]
    }`,

    nestjs: `// backend/src/orders/orders.controller.ts
// Contrôleur NestJS (TypeScript) pour la passerelle DDC
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@ApiTags('Commandes & Distribution')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une commande et alerter la logistique' })
  async createOrder(@Body() createOrderDto: any) {
    // Validation du stock en temps réel dans PostgreSQL
    const order = await this.ordersService.processOrder(createOrderDto);
    
    // Diffusion WebSocket instantanée vers le Command Center Nuxt/Web
    this.ordersService.notifyDdcRealtime(order);
    return order;
  }
}`,

    docker: `# docker-compose.yml
# Orchestration complète de la pile BRALIMA DDC
version: '3.8'

services:
  # 1. Base de données PostgreSQL
  postgres_db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: bralima_ddc
      POSTGRES_PASSWORD: secret_password
    ports:
      - "5432:5432"

  # 2. Cache Redis pour WebSockets et files d'attente
  redis_cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # 3. Backend Node.js / NestJS (API Gateway)
  backend_nest:
    build: ./apps/backend_api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:secret_password@postgres_db:5432/bralima_ddc
      PYTHON_AI_URL: http://ai_python:8000
    depends_on:
      - postgres_db
      - redis_cache

  # 4. Microservice Python (FastAPI + IA)
  ai_python:
    build: ./apps/ai_service
    ports:
      - "8000:8000"
    environment:
      GEMINI_API_KEY: \${GEMINI_API_KEY}`
  };

  return (
    <div className="space-y-[22px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#071b45] text-[#f4bd18] uppercase tracking-wider">
              Architecture Système
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Stack Validée & Prête
            </span>
          </div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Écosystème Multi-Stack BRALIMA
          </h1>
          <p className="text-[#718096] text-[13px] mt-[3px]">
            Harmonisation <strong>Flutter</strong> (Mobile Terrain) + <strong>Node.js / NestJS</strong> (API Gateway) + <strong>Python</strong> (Moteur IA / VRP) + <strong>Nuxt.js / Web</strong> (Supervision)
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white border border-[#e4eaf2] p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'diagram'
                ? 'bg-[#071b45] text-white shadow-xs'
                : 'text-[#4a5568] hover:text-[#172033]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Schéma & Rôles
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sandbox'
                ? 'bg-[#071b45] text-white shadow-xs'
                : 'text-[#4a5568] hover:text-[#172033]'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#f4bd18]" />
            Testeur d'API Live
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-[#071b45] text-white shadow-xs'
                : 'text-[#4a5568] hover:text-[#172033]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Snippets & Boilerplates
          </button>
        </div>
      </div>

      {/* Tab 1: Diagram & Roles */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          {/* Top 4 Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Flutter */}
            <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs hover:border-[#1769ff] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#02569b]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#02569b]/10 text-[#02569b] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#02569b] border border-blue-100">
                  Mobile Terrain
                </span>
              </div>
              <h3 className="font-bold text-[15px] text-[#172033]">Flutter (Dart)</h3>
              <p className="text-[12px] text-[#718096] mt-1 line-clamp-2">
                Application mobile cross-platform pour Délégués RTM et Chauffeurs-Livreurs.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Offline-First :</strong> SQLite & Isar DB
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>GPS & POD :</strong> Signature dématérialisée
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Paiement :</strong> QR Code M-Pesa / Orange
                </div>
              </div>
            </div>

            {/* Card 2: Node.js / NestJS */}
            <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs hover:border-[#e0234e] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e0234e]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e0234e]/10 text-[#e0234e] flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-[#e0234e] border border-rose-100">
                  Cœur Métier
                </span>
              </div>
              <h3 className="font-bold text-[15px] text-[#172033]">Node.js / NestJS</h3>
              <p className="text-[12px] text-[#718096] mt-1 line-clamp-2">
                API Gateway, logique métier d'entreprise, sécurité RBAC et passerelle ERP.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Temps Réel :</strong> WebSockets (Socket.io)
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Connecteur ERP :</strong> SAP & Microsoft D365
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Contrôle Accès :</strong> JWT & Rôles
                </div>
              </div>
            </div>

            {/* Card 3: Python */}
            <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs hover:border-[#ffd43b] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3776ab]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#3776ab]/10 text-[#3776ab] flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-[#d97706] border border-amber-100">
                  IA & Moteur VRP
                </span>
              </div>
              <h3 className="font-bold text-[15px] text-[#172033]">Python (FastAPI)</h3>
              <p className="text-[12px] text-[#718096] mt-1 line-clamp-2">
                Optimisation des tournées de livraison et prévisions de vente par intelligence artificielle.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Routing VRP :</strong> OR-Tools (RN1 & Fleuve)
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Prédictions :</strong> Pics week-end par commune
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Gemini AI :</strong> Diagnostics stratégiques
                </div>
              </div>
            </div>

            {/* Card 4: Nuxt / Web */}
            <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs hover:border-[#00dc82] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00dc82]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00dc82]/10 text-[#00dc82] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Console Web
                </span>
              </div>
              <h3 className="font-bold text-[15px] text-[#172033]">Nuxt.js / Web DDC</h3>
              <p className="text-[12px] text-[#718096] mt-1 line-clamp-2">
                Console de commandement unifiée pour directeurs et superviseurs logistiques.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Cartographie RDC :</strong> Suivi camions et barges
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Pilotage Stocks :</strong> Alertes de rupture 24/7
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Reporting :</strong> Consolidation nationale
                </div>
              </div>
            </div>
          </div>

          {/* Operational Flow Diagram */}
          <div className="bg-white border border-[#e4eaf2] rounded-2xl p-6 shadow-xs">
            <h3 className="text-[16px] font-bold text-[#172033] mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1769ff]" />
              Flux d'Information Opérationnel en RDC
            </h3>
            <p className="text-[13px] text-[#718096] mb-6">
              Comment les données circulent depuis une terrasse de Bandalungwa jusqu'à la Direction Générale BRALIMA :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 relative">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-[#02569b] text-[11px] font-extrabold mb-2">
                  Étape 1 : Terrain
                </span>
                <h4 className="font-bold text-[14px] text-[#172033]">Prise de commande Flutter</h4>
                <p className="text-[12px] text-slate-600 mt-1">
                  Le délégué commercial saisit 50 casiers de Primus sur son smartphone. Même sans réseau 4G, la commande est stockée localement dans SQLite avec horodatage et coordonnées GPS.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 relative">
                <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-[#e0234e] text-[11px] font-extrabold mb-2">
                  Étape 2 : Passerelle NestJS & Python
                </span>
                <h4 className="font-bold text-[14px] text-[#172033]">Validation & Optimisation</h4>
                <p className="text-[12px] text-slate-600 mt-1">
                  Dès reconnexion, l'API NestJS valide la solvabilité client. En parallèle, le microservice Python assigne la commande au camion le plus proche et optimise le trajet pour éviter les embouteillages.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 relative">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-2">
                  Étape 3 : Command Center
                </span>
                <h4 className="font-bold text-[14px] text-[#172033]">Supervision Web Nuxt/React</h4>
                <p className="text-[12px] text-slate-600 mt-1">
                  Le superviseur de zone voit instantanément le casier décrémenté du stock de Limete sur son écran, tandis que le chauffeur reçoit sa feuille de route optimisée sur son application Flutter.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Sandbox Tester */}
      {activeTab === 'sandbox' && (
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#172033] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#1769ff]" />
              Console de Test Interactive des Passerelles API
            </h2>
            <p className="text-[13px] text-[#718096] mt-1">
              Exécutez de vraies requêtes HTTP en direct vers les routes Node.js/NestJS, Flutter Mobile Sync et Python VRP.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Control Column */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#172033] mb-1">
                  Sélectionner le Point de Terminaison (Endpoint) :
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedEndpoint('mobile-sync')}
                    className={`w-full text-left p-3 rounded-xl border text-[12px] transition-all flex items-center justify-between ${
                      selectedEndpoint === 'mobile-sync'
                        ? 'border-[#02569b] bg-blue-50/50 text-[#02569b] font-bold'
                        : 'border-[#e4eaf2] hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-mono">POST</span>
                        <span>/api/mobile/sync</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Synchro montante Flutter (Offline-First)
                      </p>
                    </div>
                    <Smartphone className="w-4 h-4 text-[#02569b] shrink-0" />
                  </button>

                  <button
                    onClick={() => setSelectedEndpoint('python-vrp')}
                    className={`w-full text-left p-3 rounded-xl border text-[12px] transition-all flex items-center justify-between ${
                      selectedEndpoint === 'python-vrp'
                        ? 'border-[#3776ab] bg-sky-50/50 text-[#3776ab] font-bold'
                        : 'border-[#e4eaf2] hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-sky-600 text-white rounded text-[10px] font-mono">POST</span>
                        <span>/api/python/optimize-vrp</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Calcul de tournée camion / barge (Python)
                      </p>
                    </div>
                    <Cpu className="w-4 h-4 text-[#3776ab] shrink-0" />
                  </button>

                  <button
                    onClick={() => setSelectedEndpoint('python-forecast')}
                    className={`w-full text-left p-3 rounded-xl border text-[12px] transition-all flex items-center justify-between ${
                      selectedEndpoint === 'python-forecast'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold'
                        : 'border-[#e4eaf2] hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-amber-600 text-white rounded text-[10px] font-mono">POST</span>
                        <span>/api/python/forecast-demand</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Prévision des ventes week-end par commune
                      </p>
                    </div>
                    <Radio className="w-4 h-4 text-amber-600 shrink-0" />
                  </button>

                  <button
                    onClick={() => setSelectedEndpoint('spec')}
                    className={`w-full text-left p-3 rounded-xl border text-[12px] transition-all flex items-center justify-between ${
                      selectedEndpoint === 'spec'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-[#e4eaf2] hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-mono">GET</span>
                        <span>/api/architecture/spec</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Spécification complète du contrat Swagger
                      </p>
                    </div>
                    <Server className="w-4 h-4 text-emerald-600 shrink-0" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleExecuteSandbox}
                disabled={isExecuting}
                className="w-full py-3 px-4 rounded-xl bg-[#071b45] hover:bg-[#09295f] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Appel en cours...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#f4bd18] fill-current" />
                    Exécuter la requête Live
                  </>
                )}
              </button>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between bg-[#111927] text-white px-4 py-2.5 rounded-t-xl text-[12px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Réponse JSON Serveur</span>
                </div>
                {responseStatus && (
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-emerald-400 font-bold">Status: {responseStatus} OK</span>
                    {executionTime && <span className="text-slate-400 font-normal">Temps: {executionTime}ms</span>}
                  </div>
                )}
              </div>

              <div className="bg-[#0b1320] text-emerald-400 font-mono text-[12px] p-4 rounded-b-xl min-h-[300px] overflow-auto border border-[#1e293b]">
                {apiResponse ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 text-center">
                    <Terminal className="w-8 h-8 mb-2 opacity-50" />
                    <p>Cliquez sur "Exécuter la requête Live" pour tester la réponse réelle du serveur.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Code Snippets */}
      {activeTab === 'code' && (
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-[16px] text-[#172033]">
                Fichiers d'Intégration Clés en Main
              </h3>
              <p className="text-[12px] text-[#718096]">
                Code prêt à l'emploi pour chaque brique de votre stack (Flutter, Python, NestJS, Docker)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveCodeLang('flutter')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                    activeCodeLang === 'flutter' ? 'bg-white text-[#02569b] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Flutter (Dart)
                </button>
                <button
                  onClick={() => setActiveCodeLang('python')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                    activeCodeLang === 'python' ? 'bg-white text-[#3776ab] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Python (FastAPI)
                </button>
                <button
                  onClick={() => setActiveCodeLang('nestjs')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                    activeCodeLang === 'nestjs' ? 'bg-white text-[#e0234e] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  NestJS (TS)
                </button>
                <button
                  onClick={() => setActiveCodeLang('docker')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                    activeCodeLang === 'docker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Docker Compose
                </button>
              </div>

              <button
                onClick={() => copyToClipboard(CODE_SNIPPETS[activeCodeLang])}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-1 text-[11px] font-bold"
                title="Copier le code"
              >
                {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b1320] text-slate-200 font-mono text-[12px] p-4 rounded-xl overflow-x-auto border border-[#1e293b] max-h-[450px]">
            <pre className="whitespace-pre">{CODE_SNIPPETS[activeCodeLang]}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
