import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertTriangle, Clock, MapPin, Search, Navigation, Ship } from 'lucide-react';
import { DeliveryTrip, RegionType } from '../types';

interface DeliveriesViewProps {
  trips: DeliveryTrip[];
  currentRegion: RegionType;
  onUpdateTripStatus: (tripId: string, status: DeliveryTrip['status']) => void;
}

export const DeliveriesView: React.FC<DeliveriesViewProps> = ({
  trips,
  currentRegion,
  onUpdateTripStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter((t) => {
    const matchesRegion = currentRegion === 'Toutes les régions' || t.region === currentRegion;
    const matchesSearch =
      t.truckPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Suivi Flotte & Livraisons — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Télématique en temps réel des camions de distribution urbaine et barges fluviales BRALIMA
          </p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Véhicules & Barges Actifs</span>
          <div className="text-[20px] font-bold text-[#172033] mt-1">{filteredTrips.length} unités</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Casiers en mouvement</span>
          <div className="text-[20px] font-bold text-[#1769ff] mt-1">
            {filteredTrips.reduce((acc, t) => acc + t.casiersCount, 0).toLocaleString('fr-FR')}
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Livraisons effectuées</span>
          <div className="text-[20px] font-bold text-[#18a66a] mt-1">
            {filteredTrips.filter((t) => t.status === 'Arrivé').length}
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Alertes Retards</span>
          <div className="text-[20px] font-bold text-red-600 mt-1">
            {filteredTrips.filter((t) => t.status === 'Retardé').length} convoi
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-3 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par immatriculation, chauffeur, axe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[#e4eaf2] rounded-lg outline-none focus:border-[#1769ff] bg-[#fafcff]"
          />
        </div>
      </div>

      {/* Deliveries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrips.map((trip) => {
          const isBarge = trip.truckPlate.includes('BARGE');
          const statusBadge =
            trip.status === 'Arrivé' ? 'bg-emerald-100 text-emerald-800' :
            trip.status === 'En route' ? 'bg-blue-100 text-blue-800' :
            trip.status === 'Retardé' ? 'bg-red-100 text-red-800 animate-pulse' :
            'bg-amber-100 text-amber-800';

          return (
            <div
              key={trip.id}
              className="bg-white border border-[#e4eaf2] rounded-xl p-4 shadow-xs hover:border-[#1769ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[#eaf1ff] text-[#1769ff] flex items-center justify-center shrink-0">
                      {isBarge ? <Ship className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#172033] text-[14px] flex items-center gap-2">
                        {trip.truckPlate}
                        <span className="text-[11px] font-normal text-slate-500 font-mono">({trip.id})</span>
                      </div>
                      <span className="text-[11px] text-[#718096] block">
                        Chauffeur : <strong>{trip.driverName}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                    {trip.status}
                  </span>
                </div>

                {/* Route & Cargo */}
                <div className="mt-4 bg-[#f8fafc] p-3 rounded-lg border border-slate-100 text-[12px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1769ff]" /> Destination:
                    </span>
                    <strong className="text-[#172033]">{trip.destination} ({trip.region})</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cargaison :</span>
                    <span className="font-medium text-[#172033]">{trip.cargo}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Départ : {trip.departureTime}</span>
                    <span className="font-bold text-[#1769ff]">ETA : {trip.eta}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-[#718096] mb-1">
                    <span>Avancement du trajet</span>
                    <strong>{trip.progressPercent}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        trip.status === 'Retardé' ? 'bg-red-500' :
                        trip.status === 'Arrivé' ? 'bg-emerald-500' : 'bg-[#1769ff]'
                      }`}
                      style={{ width: `${trip.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 font-medium">
                  {trip.casiersCount.toLocaleString('fr-FR')} casiers
                </span>

                <div className="flex items-center gap-2">
                  {trip.status !== 'Arrivé' && (
                    <button
                      onClick={() => onUpdateTripStatus(trip.id, 'Arrivé')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer arrivée
                    </button>
                  )}
                  {trip.status === 'Arrivé' && (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Déchargement complété
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
