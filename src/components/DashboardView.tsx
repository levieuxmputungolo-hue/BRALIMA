import React, { useState } from 'react';
import {
  ShoppingCart,
  Package,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { ProductItem, IncidentItem, RegionType, ModuleType } from '../types';

interface DashboardViewProps {
  currentRegion: RegionType;
  onChangeRegion: (region: RegionType) => void;
  products: ProductItem[];
  incidents: IncidentItem[];
  onOpenNewOrder: () => void;
  onOpenNewIncident: () => void;
  onNavigateTo: (module: ModuleType) => void;
  onResolveIncident: (id: string) => void;
}

// Interactive Map Pins data corresponding to DRC major hubs
const MAP_PINS = [
  { id: 'kin', name: 'Hub Kinshasa (Limete & Kingabwa)', x: 18, y: 56, type: 'primary', status: 'Optimal (64 200 casiers)', color: 'blue' },
  { id: 'mat', name: 'Port de Matadi / Boma', x: 14, y: 64, type: 'port', status: 'Transit Maritime (19 700 casiers)', color: 'blue' },
  { id: 'kan', name: 'Dépôt Kananga (Kasaï-Central)', x: 42, y: 63, type: 'critical', status: 'Stock Critique (6 100 casiers)', color: 'red' },
  { id: 'lsh', name: 'Brasserie Lubumbashi (Katanga)', x: 68, y: 84, type: 'factory', status: 'Optimal (48 500 casiers)', color: 'green' },
  { id: 'gom', name: 'Dépôt Goma (Nord-Kivu)', x: 79, y: 44, type: 'hub', status: 'Vigilance (14 200 casiers)', color: 'blue' },
  { id: 'kis', name: 'Brasserie Kisangani (Tshopo)', x: 58, y: 32, type: 'barge', status: 'Optimal (26 800 casiers)', color: 'green' },
  { id: 'mbd', name: 'Relais Fluvial Mbandaka', x: 30, y: 34, type: 'river', status: 'Navette Fluviale active', color: 'blue' }
];

const SALES_DAYS = [
  { day: '11/09', heightPercent: 35, casiers: '38 400 casiers', cdf: '1,075 M CDF' },
  { day: '12/09', heightPercent: 48, casiers: '52 800 casiers', cdf: '1,478 M CDF' },
  { day: '13/09', heightPercent: 56, casiers: '61 600 casiers', cdf: '1,724 M CDF' },
  { day: '14/09', heightPercent: 51, casiers: '56 100 casiers', cdf: '1,570 M CDF' },
  { day: '15/09', heightPercent: 70, casiers: '77 000 casiers', cdf: '2,156 M CDF' },
  { day: '16/09', heightPercent: 66, casiers: '72 600 casiers', cdf: '2,032 M CDF' },
  { day: '17/09', heightPercent: 88, casiers: '96 800 casiers', cdf: '2,710 M CDF' }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRegion,
  onChangeRegion,
  products,
  incidents,
  onOpenNewOrder,
  onOpenNewIncident,
  onNavigateTo,
  onResolveIncident
}) => {
  const [activePin, setActivePin] = useState<typeof MAP_PINS[0] | null>(null);
  const [chartMode, setChartMode] = useState<'volume' | 'valeur'>('volume');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Region specific multipliers
  const regionMultiplier =
    currentRegion === 'Kinshasa' ? 0.48 :
    currentRegion === 'Lubumbashi' ? 0.24 :
    currentRegion === 'Goma' ? 0.12 :
    currentRegion === 'Kananga' ? 0.08 :
    currentRegion === 'Kisangani' ? 0.05 :
    currentRegion === 'Matadi' ? 0.03 : 1;

  const totalOrders = Math.round(1248 * regionMultiplier);
  const activePOS = Math.round(3562 * regionMultiplier);
  const activeDeliveries = Math.round(287 * regionMultiplier);
  const criticalStocks = currentRegion === 'Toutes les régions' ? 12 : Math.max(1, Math.round(12 * regionMultiplier));

  return (
    <div className="space-y-[22px]">
      {/* ================= TITLE & REGION SELECTOR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] sm:text-[27px] font-extrabold text-[#172033] tracking-tight">
            Tableau de bord — {currentRegion === 'Toutes les régions' ? 'National' : currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Vue d’ensemble de la distribution BRALIMA en République Démocratique du Congo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            id="region-filter-select"
            value={currentRegion}
            onChange={(e) => onChangeRegion(e.target.value as RegionType)}
            className="py-[9px] px-[14px] border border-[#e4eaf2] bg-white rounded-[9px] text-[13px] font-semibold text-[#172033] outline-none shadow-xs hover:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15 transition-all cursor-pointer"
          >
            <option value="Toutes les régions">Toutes les régions</option>
            <option value="Kinshasa">Kinshasa</option>
            <option value="Lubumbashi">Lubumbashi</option>
            <option value="Goma">Goma</option>
            <option value="Kananga">Kananga</option>
            <option value="Kisangani">Kisangani</option>
            <option value="Matadi">Matadi</option>
          </select>

          {/* Quick Action buttons */}
          <button
            onClick={onOpenNewOrder}
            className="bg-[#1769ff] hover:bg-[#1255d6] text-white text-[13px] font-semibold py-[9px] px-[14px] rounded-[9px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle commande</span>
          </button>

          <button
            onClick={() => onNavigateTo('IA & Analyses')}
            className="bg-[#071b45] hover:bg-[#0b2d68] text-white text-[13px] font-semibold py-[9px] px-[14px] rounded-[9px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border border-[#f4bd18]/40"
          >
            <Sparkles className="w-4 h-4 text-[#f4bd18]" />
            <span className="hidden md:inline">Analyse IA</span>
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {/* KPI 1: Commandes */}
        <div
          onClick={() => onNavigateTo('Commandes')}
          className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] hover:shadow-md hover:border-[#1769ff]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#718096] text-[12px] font-medium block">
                Commandes aujourd’hui
              </span>
              <div className="text-[25px] font-black text-[#172033] my-[8px] tracking-tight group-hover:text-[#1769ff] transition-colors">
                {totalOrders.toLocaleString('fr-FR')}
              </div>
              <span className="text-[#18a66a] text-[11px] font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs hier
              </span>
            </div>
            <div className="w-[43px] h-[43px] rounded-[11px] flex justify-center items-center bg-[#eaf1ff] text-[#1769ff] text-[19px] shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* KPI 2: Points de vente */}
        <div
          onClick={() => onNavigateTo('Points de vente')}
          className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] hover:shadow-md hover:border-[#1769ff]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#718096] text-[12px] font-medium block">
                Points de vente actifs
              </span>
              <div className="text-[25px] font-black text-[#172033] my-[8px] tracking-tight group-hover:text-[#1769ff] transition-colors">
                {activePOS.toLocaleString('fr-FR')}
              </div>
              <span className="text-[#18a66a] text-[11px] font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8% vs hier
              </span>
            </div>
            <div className="w-[43px] h-[43px] rounded-[11px] flex justify-center items-center bg-[#eaf1ff] text-[#1769ff] text-[19px] shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* KPI 3: Livraisons */}
        <div
          onClick={() => onNavigateTo('Livraisons')}
          className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] hover:shadow-md hover:border-[#1769ff]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#718096] text-[12px] font-medium block">
                Livraisons en cours
              </span>
              <div className="text-[25px] font-black text-[#172033] my-[8px] tracking-tight group-hover:text-[#1769ff] transition-colors">
                {activeDeliveries.toLocaleString('fr-FR')}
              </div>
              <span className="text-[#18a66a] text-[11px] font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +15% vs hier
              </span>
            </div>
            <div className="w-[43px] h-[43px] rounded-[11px] flex justify-center items-center bg-[#eaf1ff] text-[#1769ff] text-[19px] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* KPI 4: Stocks critiques */}
        <div
          onClick={() => onNavigateTo('Stocks')}
          className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] hover:shadow-md hover:border-[#e5484d]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#718096] text-[12px] font-medium block">
                Stocks critiques
              </span>
              <div className="text-[25px] font-black text-[#e5484d] my-[8px] tracking-tight">
                {criticalStocks}
              </div>
              <span className="text-[#e5484d] text-[11px] font-bold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> ↓ -5% vs hier
              </span>
            </div>
            <div className="w-[43px] h-[43px] rounded-[11px] flex justify-center items-center bg-[#ffe9ea] text-[#e5484d] text-[19px] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRID 1: CHART + INTERACTIVE MAP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[16px]">
        {/* CHART CARD */}
        <div className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[15px]">
            <div>
              <div className="text-[14px] font-bold text-[#172033]">
                Évolution des ventes — 7 derniers jours
              </div>
              <div className="text-[11px] text-[#718096]">
                Pic d'activité hebdomadaire : Vendredi & Samedi
              </div>
            </div>

            <div className="flex items-center bg-[#f4f7fb] p-1 rounded-lg border border-[#e4eaf2] text-[11px]">
              <button
                onClick={() => setChartMode('volume')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  chartMode === 'volume' ? 'bg-white shadow-xs text-[#1769ff] font-bold' : 'text-[#718096]'
                }`}
              >
                Volume (Casiers)
              </button>
              <button
                onClick={() => setChartMode('valeur')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  chartMode === 'valeur' ? 'bg-white shadow-xs text-[#1769ff] font-bold' : 'text-[#718096]'
                }`}
              >
                Chiffre d'affaires
              </button>
            </div>
          </div>

          {/* Dynamic Interactive Chart Bars */}
          <div className="relative">
            {hoveredBarIndex !== null && (
              <div className="absolute top-0 right-4 bg-[#071b45] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg z-10 animate-fade-in flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#f4bd18]" />
                <span>
                  <strong>{SALES_DAYS[hoveredBarIndex].day}:</strong>{' '}
                  {chartMode === 'volume' ? SALES_DAYS[hoveredBarIndex].casiers : SALES_DAYS[hoveredBarIndex].cdf}
                </span>
              </div>
            )}

            <div className="h-[210px] flex items-end gap-[13px] p-[10px] border-b border-[#e4eaf2]">
              {SALES_DAYS.map((item, idx) => (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 h-full flex flex-col justify-end group cursor-pointer"
                >
                  <div
                    style={{ height: `${item.heightPercent}%` }}
                    className="w-full bg-gradient-to-b from-[#4b8cff] to-[#1769ff] rounded-t-[6px] group-hover:from-[#f4bd18] group-hover:to-[#f59e0b] transition-all duration-200 shadow-xs relative"
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-800 text-white px-1 rounded transition-opacity">
                      {item.heightPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-[13px] pt-[8px]">
              {SALES_DAYS.map((item, idx) => (
                <span
                  key={item.day}
                  className={`flex-1 text-center text-[10px] font-semibold transition-colors ${
                    hoveredBarIndex === idx ? 'text-[#1769ff] font-bold' : 'text-[#718096]'
                  }`}
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#718096]">
            <span>Total 7 jours : <strong>455 300 casiers</strong></span>
            <button
              onClick={() => onNavigateTo('Rapports')}
              className="text-[#1769ff] font-semibold hover:underline"
            >
              Voir le rapport détaillé →
            </button>
          </div>
        </div>

        {/* INTERACTIVE MAP CARD */}
        <div className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[12px]">
            <div>
              <div className="text-[14px] font-bold text-[#172033]">
                Carte des points de vente & dépôts
              </div>
              <div className="text-[11px] text-[#718096]">
                Réseau de distribution national (RDC)
              </div>
            </div>
            <button
              onClick={() => onNavigateTo('Carte RDC')}
              className="text-[11px] font-semibold text-[#1769ff] hover:underline"
            >
              Plein écran
            </button>
          </div>

          {/* Stylized DRC Map Graphic */}
          <div className="h-[210px] rounded-[12px] relative overflow-hidden bg-gradient-to-br from-[#e7f1e7] to-[#cfe3d3] border border-[#d2e4d5] select-none">
            {/* Congo River stylized curves */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path
                d="M 60 170 Q 75 140 90 120 T 150 80 T 220 85 T 260 130"
                fill="none"
                stroke="#6fa8dc"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 60 170 Q 70 180 80 200"
                fill="none"
                stroke="#6fa8dc"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* Provinces watermark grid lines */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(30deg, transparent 48%, rgba(255,255,255,.9) 49%, transparent 51%), linear-gradient(120deg, transparent 48%, rgba(255,255,255,.9) 49%, transparent 51%)`,
                backgroundSize: '75px 60px'
              }}
            />

            {/* Interactive Pins */}
            {MAP_PINS.map((pin) => {
              const isSelected = activePin?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setActivePin(pin)}
                  title={`${pin.name}: ${pin.status}`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-transform ${
                    isSelected ? 'scale-150 z-20 ring-4 ring-[#071b45]' : 'hover:scale-125 z-10'
                  }`}
                >
                  <span
                    className={`block w-[12px] h-[12px] rounded-full shadow-md ${
                      pin.color === 'green'
                        ? 'bg-[#18a66a] ring-4 ring-[#18a66a]/20'
                        : pin.color === 'red'
                        ? 'bg-[#e5484d] ring-4 ring-[#e5484d]/25 animate-ping'
                        : 'bg-[#1769ff] ring-4 ring-[#1769ff]/20'
                    }`}
                  />
                </button>
              );
            })}

            {/* Selected Pin Mini HUD overlay */}
            {activePin && (
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-lg p-2 border border-[#e4eaf2] shadow-lg text-[11px] z-30 flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="font-bold text-[#071b45] block truncate">{activePin.name}</span>
                  <span className="text-[#718096] text-[10px]">{activePin.status}</span>
                </div>
                <button
                  onClick={() => onNavigateTo('Stocks')}
                  className="bg-[#1769ff] text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 hover:bg-[#1255d6]"
                >
                  Gérer
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px] text-[#718096]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1769ff]" /> Hubs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#18a66a]" /> Brasseries
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5484d]" /> Tension
              </span>
            </div>
            <button
              onClick={() => onNavigateTo('Carte RDC')}
              className="text-[#1769ff] font-semibold hover:underline"
            >
              Vue satellite RDC →
            </button>
          </div>
        </div>
      </div>

      {/* ================= GRID 2: TOP PRODUITS + INCIDENTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        {/* TOP PRODUITS CARD */}
        <div className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)]">
          <div className="flex items-center justify-between mb-[15px]">
            <div className="text-[14px] font-bold text-[#172033]">
              Top produits
            </div>
            <button
              onClick={() => onNavigateTo('Stocks')}
              className="text-[11px] font-semibold text-[#1769ff] hover:underline"
            >
              Tous les produits ({products.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
            {products.slice(0, 4).map((p) => {
              // Custom visual colors per brand
              const brandColor =
                p.brand === 'Primus' ? 'from-amber-100 to-amber-50 text-amber-950 border-amber-200' :
                p.brand === 'Castel' ? 'from-emerald-100 to-emerald-50 text-emerald-950 border-emerald-200' :
                p.brand === 'Turbo King' ? 'from-orange-100 to-orange-50 text-orange-950 border-orange-200' :
                p.brand === 'Tango' ? 'from-red-100 to-red-50 text-red-950 border-red-200' :
                'from-blue-100 to-blue-50 text-blue-950 border-blue-200';

              return (
                <div
                  key={p.id}
                  onClick={() => onNavigateTo('Stocks')}
                  className="border border-[#e4eaf2] rounded-[10px] p-[10px] hover:border-[#1769ff]/50 hover:shadow-xs transition-all cursor-pointer group bg-white flex flex-col justify-between"
                >
                  {/* Bottle Mockup */}
                  <div
                    className={`h-[72px] rounded-[8px] bg-gradient-to-br ${brandColor} border flex flex-col justify-center items-center font-black text-[12px] tracking-wider shadow-inner group-hover:scale-102 transition-transform`}
                  >
                    <span className="font-extrabold tracking-widest">{p.brand.toUpperCase()}</span>
                    <span className="text-[9px] font-medium opacity-80">{p.format.split(' ')[0]}</span>
                  </div>

                  <div className="mt-[8px]">
                    <b className="block text-[11px] text-[#172033] font-bold truncate group-hover:text-[#1769ff] transition-colors">
                      {p.name}
                    </b>
                    <small className="text-[#718096] text-[9px] block mt-1 leading-tight font-medium">
                      {p.casiersSold.toLocaleString('fr-FR')} unités ·{' '}
                      <span className={p.trendPositive ? 'text-[#18a66a] font-bold' : 'text-[#e5484d] font-bold'}>
                        {p.trend}
                      </span>
                    </small>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Stock total disponible : <strong>49 720 casiers</strong></span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Taux de rotation : 94.2%</span>
          </div>
        </div>

        {/* INCIDENTS RÉCENTS CARD */}
        <div className="bg-white border border-[#e4eaf2] rounded-[14px] p-[18px] shadow-[0_3px_12px_rgba(10,31,68,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[15px]">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#172033]">
                Incidents récents
              </span>
              <span className="bg-[#ffe8e9] text-[#c93239] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {incidents.filter((i) => i.severity === 'Urgent').length} urgents
              </span>
            </div>
            <button
              onClick={onOpenNewIncident}
              className="text-[11px] font-semibold text-[#1769ff] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Signaler
            </button>
          </div>

          <div className="space-y-[12px]">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="flex items-center gap-[10px] border-b border-[#edf1f6] pb-[11px] last:border-b-0 last:pb-0 group"
              >
                <div
                  className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center shrink-0 font-bold text-[15px] ${
                    inc.severity === 'Urgent'
                      ? 'bg-[#ffe9ea] text-[#e5484d]'
                      : inc.severity === 'À suivre'
                      ? 'bg-[#fff4df] text-[#b36a00]'
                      : 'bg-[#e7f8ef] text-[#18a66a]'
                  }`}
                >
                  {inc.severity === 'Résolu' ? '✓' : '!'}
                </div>

                <div className="flex-1 min-w-0">
                  <b className="text-[11px] text-[#172033] block truncate group-hover:text-[#1769ff] transition-colors">
                    {inc.title}
                  </b>
                  <small className="block text-[#718096] text-[9px] mt-[3px] truncate">
                    {inc.timeAgo} · {inc.location} ({inc.region})
                  </small>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`py-[4px] px-[8px] rounded-[20px] text-[9px] font-bold tracking-tight ${
                      inc.severity === 'Urgent'
                        ? 'bg-[#ffe8e9] text-[#c93239]'
                        : inc.severity === 'À suivre'
                        ? 'bg-[#fff4df] text-[#b36a00]'
                        : 'bg-[#e7f8ef] text-[#138052]'
                    }`}
                  >
                    {inc.severity}
                  </span>

                  {inc.severity !== 'Résolu' && (
                    <button
                      onClick={() => onResolveIncident(inc.id)}
                      title="Marquer comme résolu"
                      className="p-1 hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 rounded transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#718096]">Temps moyen de résolution : <strong>3h 15m</strong></span>
            <button
              onClick={() => onNavigateTo('Incidents')}
              className="text-[#1769ff] font-semibold hover:underline"
            >
              Consulter tout le journal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
