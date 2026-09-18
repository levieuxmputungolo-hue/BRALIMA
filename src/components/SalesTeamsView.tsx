import React, { useState } from 'react';
import { Users, Target, CheckCircle2, Phone, Award, TrendingUp, Search } from 'lucide-react';
import { SalesRep, RegionType } from '../types';

interface SalesTeamsViewProps {
  salesReps: SalesRep[];
  currentRegion: RegionType;
}

export const SalesTeamsView: React.FC<SalesTeamsViewProps> = ({ salesReps, currentRegion }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReps = salesReps.filter((rep) => {
    const matchesRegion = currentRegion === 'Toutes les régions' || rep.region === currentRegion;
    const matchesSearch =
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const totalSold = filteredReps.reduce((acc, r) => acc + r.achievedCasiers, 0);
  const totalTarget = filteredReps.reduce((acc, r) => acc + r.monthlyTargetCasiers, 0);
  const overallPerformance = totalTarget > 0 ? Math.round((totalSold / totalTarget) * 100) : 0;

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Force de Vente & Équipes Commerciales — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Superviseurs Route-to-Market (RTM), délégués On-Trade (bars/terrasses) et animation des réseaux grossistes
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Délégués Actifs</span>
          <div className="text-[20px] font-bold text-[#172033] mt-1">{filteredReps.length} agents</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Taux Réalisation Objectifs</span>
          <div className="text-[20px] font-bold text-[#18a66a] mt-1">{overallPerformance}%</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Casiers Écoulés ce mois</span>
          <div className="text-[20px] font-bold text-[#1769ff] mt-1">{totalSold.toLocaleString('fr-FR')}</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Points de Vente Visités</span>
          <div className="text-[20px] font-bold text-[#f59e0b] mt-1">
            {filteredReps.reduce((acc, r) => acc + r.posVisited, 0)} PDV
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-3 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher un délégué commercial, zone ou commune..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[#e4eaf2] rounded-lg outline-none focus:border-[#1769ff] bg-[#fafcff]"
          />
        </div>
      </div>

      {/* Commercial Reps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReps.map((rep, idx) => {
          const percent = Math.round((rep.achievedCasiers / rep.monthlyTargetCasiers) * 100);
          const isOverAchiever = percent >= 100;

          return (
            <div
              key={rep.id}
              className="bg-white border border-[#e4eaf2] rounded-xl p-4 shadow-xs hover:border-[#1769ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#071b45] text-[#f4bd18] flex items-center justify-center font-bold text-[13px] shadow-sm">
                      {rep.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#172033] text-[14px] leading-tight">{rep.name}</h3>
                      <span className="text-[11px] font-medium text-[#1769ff] block">{rep.role}</span>
                    </div>
                  </div>

                  {isOverAchiever && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Award className="w-3 h-3" /> Top Performer
                    </span>
                  )}
                </div>

                {/* Zone & Target */}
                <div className="mt-4 space-y-2 text-[12px]">
                  <div className="text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Zone attribuée :</span>
                    <strong className="text-[#172033]">{rep.zone}</strong>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Objectif mensuel :</span>
                      <strong className="text-[#172033]">
                        {rep.achievedCasiers.toLocaleString('fr-FR')} / {rep.monthlyTargetCasiers.toLocaleString('fr-FR')} casiers
                      </strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percent >= 100 ? 'bg-[#18a66a]' : percent >= 80 ? 'bg-[#1769ff]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-slate-500">
                      {percent}% réalisé
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block">PDV audités :</span>
                    <strong className="text-slate-700">{rep.posVisited} visites</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Satisfaction :</span>
                    <strong className="text-emerald-700 font-bold">{rep.satisfactionRate}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#1769ff]" /> {rep.phone}
                </span>
                <span className="text-slate-400 text-[10px]">Région {rep.region}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
