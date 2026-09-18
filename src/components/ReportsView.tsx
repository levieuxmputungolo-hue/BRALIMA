import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { RegionType, ProductItem } from '../types';

interface ReportsViewProps {
  currentRegion: RegionType;
  products: ProductItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentRegion, products }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'hebdo' | 'mensuel' | 'trimestriel'>('hebdo');

  const handleExport = (format: string) => {
    setDownloadSuccess(`Rapport de distribution (${format}) généré pour ${currentRegion}. Téléchargement lancé.`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3500);
  };

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Rapports & Statistiques — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Synthèse d'activité commerciale, ratios de rentabilité et volumes consolidés en hectolitres (hL)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="bg-white hover:bg-slate-50 text-[#172033] border border-[#e4eaf2] text-[13px] font-semibold py-[9px] px-[14px] rounded-[10px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-red-500" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('Excel / CSV')}
            className="bg-[#18a66a] hover:bg-[#158f5b] text-white text-[13px] font-semibold py-[9px] px-[14px] rounded-[10px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-[13px] flex items-center gap-2 font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Period selector */}
      <div className="bg-white border border-[#e4eaf2] p-2 rounded-xl flex items-center gap-2 w-fit text-[12px] shadow-xs">
        <button
          onClick={() => setSelectedPeriod('hebdo')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            selectedPeriod === 'hebdo' ? 'bg-[#071b45] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semaine en cours (S38)
        </button>
        <button
          onClick={() => setSelectedPeriod('mensuel')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            selectedPeriod === 'mensuel' ? 'bg-[#071b45] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Mois de Septembre 2026
        </button>
        <button
          onClick={() => setSelectedPeriod('trimestriel')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            selectedPeriod === 'trimestriel' ? 'bg-[#071b45] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          T3 2026 Consolidé
        </button>
      </div>

      {/* High-level performance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[12px] font-medium block">Volume Total Écoulé</span>
          <div className="text-[26px] font-black text-[#172033] mt-1">
            1 244 800 <span className="text-[13px] text-slate-500 font-normal">casiers</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            Soit environ 99 584 hectolitres (hL)
          </div>
        </div>

        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[12px] font-medium block">Chiffre d'Affaires Brut</span>
          <div className="text-[26px] font-black text-[#1769ff] mt-1">
            36 120 M <span className="text-[13px] text-slate-500 font-normal">CDF</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Environ 12.9 Millions USD équivalent
          </div>
        </div>

        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[12px] font-medium block">Taux de Service Logistique (OTIF)</span>
          <div className="text-[26px] font-black text-[#18a66a] mt-1">
            96.4%
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            On-Time In-Full (+1.8% vs mois précédent)
          </div>
        </div>
      </div>

      {/* Brand Shares Table & Progress */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-5 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#172033] mb-3">
          Part de Marché par Marque BRALIMA
        </h2>

        <div className="space-y-4">
          {[
            { name: 'Primus (33cl & 50cl)', share: 42, color: 'bg-amber-500', units: '522 800 casiers' },
            { name: 'Castel Beer (50cl & 65cl)', share: 29, color: 'bg-emerald-600', units: '361 000 casiers' },
            { name: 'Turbo King (65cl)', share: 14, color: 'bg-orange-600', units: '174 200 casiers' },
            { name: 'Muttzig & Heineken', share: 9, color: 'bg-blue-600', units: '112 000 casiers' },
            { name: 'Gamme Sans Alcool (Vitalo, Maltina, Fayrouz)', share: 6, color: 'bg-purple-600', units: '74 800 casiers' }
          ].map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="font-semibold text-[#172033]">{item.name}</span>
                <span className="text-slate-600 text-[12px]">
                  <strong>{item.share}%</strong> ({item.units})
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
