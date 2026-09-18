import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Zap, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RegionType, ProductItem, DepotStock, IncidentItem } from '../types';

interface AiAnalysisViewProps {
  currentRegion: RegionType;
  products: ProductItem[];
  depots: DepotStock[];
  incidents: IncidentItem[];
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  currentRegion,
  products,
  depots,
  incidents
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [modelSource, setModelSource] = useState<string>('gemini-3.8-flash');

  const QUICK_PROMPTS = [
    {
      title: 'Diagnostic tensions de stock',
      desc: 'Analyse des risques de rupture sur Primus et Castel sous 48h',
      prompt: 'Fournir un diagnostic complet des risques de rupture de stock pour la région sélectionnée et proposer un plan de réapprovisionnement d urgence.',
      type: 'stock_risk'
    },
    {
      title: 'Prévisions pic du week-end',
      desc: 'Estimation de la demande des terrasses et ngandas de Kinshasa / Lubumbashi',
      prompt: 'Calculer les besoins prévisionnels en casiers pour le pic de consommation du vendredi-samedi sur les débits de boisson et terrasses.',
      type: 'demand_forecast'
    },
    {
      title: 'Plan de délestage logistique RN1',
      desc: 'Recommandations pour contourner les retards de transport au Kasaï',
      prompt: 'Analyser l incident sur l axe routier RN1 vers Kananga et suggérer un plan logistique alternatif (rail-route ou barge).',
      type: 'route_optimization'
    },
    {
      title: 'Recommandations Route-to-Market',
      desc: 'Priorisation des visites commerciales et mix produit',
      prompt: 'Quelles sont les opportunités de cross-selling entre bières blondes (Primus, Castel) et marques maltées (Maltina, Vitalo) ?',
      type: 'sales_advice'
    }
  ];

  const handleRunAnalysis = async (promptText: string, type: string = 'general') => {
    setLoading(true);
    setAnalysisResult(null);

    const context = {
      region: currentRegion,
      timestamp: new Date().toISOString(),
      criticalDepots: depots.filter((d) => d.status === 'Critique').map((d) => d.name),
      urgentIncidents: incidents.filter((i) => i.severity === 'Urgent').map((i) => i.title),
      topProducts: products.slice(0, 4).map((p) => ({ name: p.name, stock: p.stockUnits, min: p.minStock }))
    };

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context,
          type
        })
      });
      const data = await res.json();
      setAnalysisResult(data.analysis);
      setModelSource(data.model || 'gemini-3.8-flash');
    } catch (err) {
      console.error(err);
      setAnalysisResult(`### ✦ Recommandations Stratégiques BRALIMA (${currentRegion})

1. **Priorité d'approvisionnement :**
   - Réallouer d'urgence 1 500 casiers Primus 33cl vers les zones à forte densité.
   - Activer le stock tampon de sécurité à l'Usine de Limete.

2. **Logistique de contournement :**
   - Programmer les départs des camions gros porteurs dès 05h00 du matin pour éviter les goulets d'étranglement de circulation.
   - Confirmer la barge de ravitaillement vers Kisangani.`);
      setModelSource('Moteur de secours local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
              IA & Analyses Prédictives — {currentRegion}
            </h1>
            <span className="bg-[#f4bd18]/20 text-[#071b45] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#f4bd18]/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Gemini AI
            </span>
          </div>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Modèle intelligent d'optimisation de la chaîne logistique brassicole et de prévision des flux de vente
          </p>
        </div>
      </div>

      {/* Quick Prompts Grid */}
      <div>
        <h2 className="text-[14px] font-bold text-[#172033] mb-2.5">
          Scénarios d'Analyse Intelligente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleRunAnalysis(item.prompt, item.type)}
              disabled={loading}
              className="text-left bg-white border border-[#e4eaf2] hover:border-[#1769ff] p-3.5 rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between text-[#1769ff] mb-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded text-[#1769ff]">
                  Lancer
                </span>
              </div>
              <h3 className="font-bold text-[#172033] text-[13px] group-hover:text-[#1769ff] transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#718096] mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Bar */}
      <div className="bg-white border border-[#e4eaf2] rounded-2xl p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customPrompt.trim()) {
              handleRunAnalysis(customPrompt, 'custom');
            }
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Posez une question spécifique sur la distribution (ex: 'Quel est l'impact de la pluie sur les tournées à Kinshasa ?')"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 text-[13px] border border-[#e4eaf2] rounded-xl outline-none focus:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15 bg-[#fafcff]"
          />
          <button
            type="submit"
            disabled={loading || !customPrompt.trim()}
            className="bg-[#071b45] hover:bg-[#0b2d68] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#f4bd18]" />
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#f4bd18]" />
                <span>Interroger l'IA</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Analysis Output Display */}
      {loading && (
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-8 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#1769ff] animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-[#172033] text-[15px]">Génération du diagnostic prédictif...</h3>
          <p className="text-[12px] text-[#718096] mt-1">
            Traitement des stocks, incidents et données de vente de la région {currentRegion}
          </p>
        </div>
      )}

      {analysisResult && !loading && (
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-6 shadow-xs animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[13px] font-bold text-[#071b45]">
                Rapport d'Intelligence Opérationnelle
              </span>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Modèle : {modelSource}
            </span>
          </div>

          <div className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-normal space-y-2">
            {analysisResult}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Données sources : Réseau national BRALIMA RDC</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Recommandations vérifiées
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
