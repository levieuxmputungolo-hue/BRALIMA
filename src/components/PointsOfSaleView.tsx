import React, { useState } from 'react';
import { MapPin, Phone, User, Search, Store, Plus, CheckCircle, ShieldAlert, ShoppingBag } from 'lucide-react';
import { PointOfSale, RegionType } from '../types';

interface PointsOfSaleViewProps {
  posList: PointOfSale[];
  currentRegion: RegionType;
  onSelectPosForOrder: (pos: PointOfSale) => void;
}

export const PointsOfSaleView: React.FC<PointsOfSaleViewProps> = ({
  posList,
  currentRegion,
  onSelectPosForOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredPOS = posList.filter((pos) => {
    const matchesRegion = currentRegion === 'Toutes les régions' || pos.region === currentRegion;
    const matchesType = typeFilter === 'all' || pos.type === typeFilter;
    const matchesSearch =
      pos.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Points de Vente Partenaires — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Cartographie des terrasses, ngandas, bars modernes et grossistes sous contrat BRALIMA
          </p>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Total Établissements</span>
          <div className="text-[20px] font-bold text-[#172033] mt-1">{filteredPOS.length}</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Rotation Hebdo Moyenne</span>
          <div className="text-[20px] font-bold text-[#1769ff] mt-1">
            {Math.round(filteredPOS.reduce((acc, p) => acc + p.weeklyCasiers, 0) / (filteredPOS.length || 1))} casiers
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Statut Crédit Sain</span>
          <div className="text-[20px] font-bold text-[#18a66a] mt-1">
            {filteredPOS.filter((p) => p.creditStatus === 'À jour').length}
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Comptes à surveiller</span>
          <div className="text-[20px] font-bold text-red-600 mt-1">
            {filteredPOS.filter((p) => p.creditStatus === 'Bloqué').length}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par terrasse, commune, gérant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[#e4eaf2] rounded-lg outline-none focus:border-[#1769ff] bg-[#fafcff]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          {['all', 'Nganda / Terrasse', 'Bar Moderne', 'Dépôt Grossiste', 'Hôtel Restaurant', 'Supérette'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                typeFilter === type
                  ? 'bg-[#071b45] text-white font-semibold'
                  : 'bg-slate-50 text-[#718096] hover:bg-slate-100 hover:text-[#172033]'
              }`}
            >
              {type === 'all' ? 'Tous les types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* POS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPOS.map((pos) => {
          const creditBadge =
            pos.creditStatus === 'À jour' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            pos.creditStatus === 'Plafond 75%' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-red-50 text-red-700 border-red-200';

          return (
            <div
              key={pos.id}
              className="bg-white border border-[#e4eaf2] rounded-xl p-4 shadow-xs hover:border-[#1769ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-[#172033] text-[15px]">{pos.name}</h3>
                    <span className="text-[11px] font-medium text-[#1769ff] block mt-0.5">{pos.type}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${creditBadge}`}>
                    {pos.creditStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-[12px] text-[#718096]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{pos.commune}, {pos.city} ({pos.region})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Gérant : <strong className="text-[#172033]">{pos.owner}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-700">{pos.phone}</span>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-[12px]">
                  <span className="text-slate-500">Volume régulier :</span>
                  <span className="font-bold text-[#071b45]">{pos.weeklyCasiers} casiers / semaine</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ID: {pos.id}</span>
                <button
                  onClick={() => onSelectPosForOrder(pos)}
                  className="bg-[#1769ff] hover:bg-[#1255d6] text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Commander
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
