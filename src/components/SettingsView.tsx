import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Database, Sliders, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState('3500');
  const [defaultCurrency, setDefaultCurrency] = useState('CDF');
  const [autoSyncInterval, setAutoSyncInterval] = useState('60');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-[20px] max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
          Paramètres du Command Center (DDC)
        </h1>
        <p className="text-[#718096] text-[13px] mt-[4px]">
          Configuration des seuils opérationnels, alertes logistiques et synchronisation ERP Brasserie
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-[13px] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Paramètres mis à jour avec succès et synchronisés avec tous les terminaux de dépôts.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Card 1: Alert thresholds */}
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-[#1769ff]" />
            <h2 className="text-[15px] font-bold text-[#172033]">Seuils d'Alerte de Stock</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block font-bold text-[#172033] mb-1">
                Seuil de Stock Critique (Casiers)
              </label>
              <input
                type="number"
                value={criticalStockThreshold}
                onChange={(e) => setCriticalStockThreshold(e.target.value)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              />
              <span className="text-[11px] text-[#718096] mt-1 block">
                Déclenche automatiquement une alerte rouge dès qu'un dépôt descend sous ce niveau.
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1">
                Devise Principale d'Affichage
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              >
                <option value="CDF">Franc Congolais (CDF) — Taux officiel</option>
                <option value="USD">Dollar Américain (USD)</option>
              </select>
              <span className="text-[11px] text-[#718096] mt-1 block">
                Convertit automatiquement les montants des commandes et statistiques.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Notifications */}
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#1769ff]" />
            <h2 className="text-[15px] font-bold text-[#172033]">Canaux de Notification</h2>
          </div>

          <div className="space-y-3 text-[13px]">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-[#1769ff] rounded"
              />
              <div>
                <strong className="block text-[#172033]">Alertes SMS / WhatsApp Business aux chauffeurs</strong>
                <span className="text-[11px] text-[#718096]">Envoi des ordres de route et modifications d'itinéraire.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#1769ff] rounded"
              />
              <div>
                <strong className="block text-[#172033]">Rapport quotidien par email à la Direction Générale</strong>
                <span className="text-[11px] text-[#718096]">Envoi quotidien à 06h00 de la consolidation nationale.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 3: System & ERP Integration */}
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-[#1769ff]" />
            <h2 className="text-[15px] font-bold text-[#172033]">Passerelles Systèmes & Multi-Stack</h2>
          </div>

          <div className="text-[12px] space-y-2 text-slate-600">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <div>
                <span className="font-bold text-slate-800">Passerelle Mobile Flutter (Offline-First) :</span>
                <p className="text-[11px] text-slate-500">Route <code>POST /api/mobile/sync</code> (SQLite / Isar)</p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Opérationnel (v3.2)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <div>
                <span className="font-bold text-slate-800">Moteur IA & VRP Python (FastAPI) :</span>
                <p className="text-[11px] text-slate-500">Route <code>POST /api/python/optimize-vrp</code> (OR-Tools)</p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Connecté
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <div>
                <span className="font-bold text-slate-800">Cœur Backend Node.js / NestJS :</span>
                <p className="text-[11px] text-slate-500">REST API Gateway & WebSockets temps réel</p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> En Ligne (Port 3000)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span>Connecteur ERP Brasserie (SAP / D365) :</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Connecté (Limete Hub)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span>Passerelle Mobile Money (M-Pesa, Airtel, Orange) :</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Opérationnelle 24/7
              </span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#1769ff] hover:bg-[#1255d6] text-white px-6 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
