import React, { useState } from 'react';
import { AlertTriangle, PlusCircle, CheckCircle2, Clock, MapPin, User, Search, Filter } from 'lucide-react';
import { IncidentItem, RegionType } from '../types';

interface IncidentsViewProps {
  incidents: IncidentItem[];
  currentRegion: RegionType;
  onOpenNewIncident: () => void;
  onResolveIncident: (id: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  currentRegion,
  onOpenNewIncident,
  onResolveIncident
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesRegion = currentRegion === 'Toutes les régions' || inc.region === currentRegion;
    const matchesStatus = statusFilter === 'all' || inc.severity === statusFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Registre des Incidents & Anomalies — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Signalement en direct des ruptures de stock, avaries de transport, retards de livraison et gestion de la casse
          </p>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="bg-[#e5484d] hover:bg-[#c93239] text-white text-[13px] font-semibold py-[10px] px-[16px] rounded-[10px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Signaler un incident</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Total Événements</span>
          <div className="text-[20px] font-bold text-[#172033] mt-1">{filteredIncidents.length}</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Urgences Critiques</span>
          <div className="text-[20px] font-bold text-red-600 mt-1">
            {filteredIncidents.filter((i) => i.severity === 'Urgent').length}
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">En cours de traitement</span>
          <div className="text-[20px] font-bold text-amber-600 mt-1">
            {filteredIncidents.filter((i) => i.severity === 'À suivre').length}
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Résolus aujourd'hui</span>
          <div className="text-[20px] font-bold text-emerald-600 mt-1">
            {filteredIncidents.filter((i) => i.severity === 'Résolu').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé, ville, type d'incident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[#e4eaf2] rounded-lg outline-none focus:border-[#1769ff] bg-[#fafcff]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          {['all', 'Urgent', 'À suivre', 'Résolu'].map((sev) => (
            <button
              key={sev}
              onClick={() => setStatusFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === sev
                  ? 'bg-[#071b45] text-white font-semibold'
                  : 'bg-slate-50 text-[#718096] hover:bg-slate-100 hover:text-[#172033]'
              }`}
            >
              {sev === 'all' ? 'Tous les statuts' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Detailed List */}
      <div className="space-y-3">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((inc) => {
            const badgeClass =
              inc.severity === 'Urgent' ? 'bg-[#ffe8e9] text-[#c93239]' :
              inc.severity === 'À suivre' ? 'bg-[#fff4df] text-[#b36a00]' :
              'bg-[#e7f8ef] text-[#138052]';

            const iconClass =
              inc.severity === 'Urgent' ? 'bg-[#ffe9ea] text-[#e5484d]' :
              inc.severity === 'À suivre' ? 'bg-[#fff4df] text-[#b36a00]' :
              'bg-[#e7f8ef] text-[#18a66a]';

            return (
              <div
                key={inc.id}
                className="bg-white border border-[#e4eaf2] rounded-xl p-4 shadow-xs hover:border-[#1769ff]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-[16px] ${iconClass}`}>
                    {inc.severity === 'Résolu' ? '✓' : '!'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-[#172033] text-[15px]">{inc.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {inc.severity}
                      </span>
                    </div>

                    <p className="text-[12px] text-[#718096] mt-1 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1769ff]" /> {inc.location} ({inc.region})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {inc.timeAgo}
                      </span>
                      {inc.assignedTo && (
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <User className="w-3 h-3 text-slate-400" /> Assigner : {inc.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {inc.severity !== 'Résolu' ? (
                    <button
                      onClick={() => onResolveIncident(inc.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Marquer comme résolu
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-[12px] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Traité & Clôturé
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e4eaf2] text-slate-400">
            Aucun incident ne correspond aux critères.
          </div>
        )}
      </div>
    </div>
  );
};
