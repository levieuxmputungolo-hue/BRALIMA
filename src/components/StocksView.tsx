import React, { useState } from 'react';
import { Package, AlertTriangle, ArrowRightLeft, CheckCircle2, Factory, RefreshCw, BarChart2 } from 'lucide-react';
import { DepotStock, ProductItem, RegionType } from '../types';

interface StocksViewProps {
  depots: DepotStock[];
  products: ProductItem[];
  currentRegion: RegionType;
  onRestockProduct: (productId: string, addedUnits: number) => void;
}

export const StocksView: React.FC<StocksViewProps> = ({
  depots,
  products,
  currentRegion,
  onRestockProduct
}) => {
  const [selectedDepot, setSelectedDepot] = useState<string>('all');
  const [transferModal, setTransferModal] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState('');

  const filteredDepots = depots.filter((d) => {
    return currentRegion === 'Toutes les régions' || d.region === currentRegion;
  });

  const totalCapacity = filteredDepots.reduce((acc, d) => acc + d.capacityCasiers, 0);
  const totalStock = filteredDepots.reduce((acc, d) => acc + d.currentCasiers, 0);
  const averageOccupancy = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  const handleSimulateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferSuccess('Ordre de transfert fluvial/routier n°TRF-2026-88 créé avec succès ! Navette en cours d assignation.');
    setTimeout(() => {
      setTransferSuccess('');
      setTransferModal(false);
    }, 2800);
  };

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Stocks & Dépôts BRALIMA — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Supervision des niveaux d'inventaire, capacités des entrepôts et réapprovisionnements
          </p>
        </div>

        <button
          onClick={() => setTransferModal(true)}
          className="bg-[#071b45] hover:bg-[#0b2d68] text-white text-[13px] font-semibold py-[10px] px-[16px] rounded-[10px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRightLeft className="w-4 h-4 text-[#f4bd18]" />
          <span>Transfert Inter-Dépôts</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#718096] text-[12px] font-medium">
            <span>Stock Global Disponible</span>
            <Package className="w-4 h-4 text-[#1769ff]" />
          </div>
          <div className="text-[24px] font-black text-[#172033] mt-2">
            {totalStock.toLocaleString('fr-FR')} <span className="text-[13px] text-[#718096] font-normal">casiers</span>
          </div>
          <div className="text-[11px] text-[#18a66a] font-semibold mt-1">
            Capacité totale : {totalCapacity.toLocaleString('fr-FR')} casiers
          </div>
        </div>

        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#718096] text-[12px] font-medium">
            <span>Taux d'occupation moyen</span>
            <BarChart2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[24px] font-black text-[#172033] mt-2">
            {averageOccupancy}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${averageOccupancy > 85 ? 'bg-red-500' : 'bg-[#1769ff]'}`}
              style={{ width: `${averageOccupancy}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-[#e4eaf2] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#718096] text-[12px] font-medium">
            <span>Points de tension critiques</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-[24px] font-black text-red-600 mt-2">
            {filteredDepots.filter((d) => d.status === 'Critique').length} dépôts
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Kananga & Kingabwa à réapprovisionner
          </div>
        </div>
      </div>

      {/* Depots Status Grid */}
      <div>
        <h2 className="text-[16px] font-bold text-[#172033] mb-3">
          État des Usines & Dépôts Relais ({filteredDepots.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepots.map((depot) => {
            const occupancy = Math.round((depot.currentCasiers / depot.capacityCasiers) * 100);
            const statusColor =
              depot.status === 'Optimal' ? 'border-emerald-200 bg-emerald-50/20 text-emerald-800' :
              depot.status === 'Vigilance' ? 'border-amber-200 bg-amber-50/20 text-amber-800' :
              'border-red-200 bg-red-50/20 text-red-800';

            return (
              <div
                key={depot.id}
                className="bg-white border border-[#e4eaf2] rounded-xl p-4 shadow-xs hover:border-[#1769ff]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#172033] text-[14px] leading-tight">{depot.name}</h3>
                      <span className="text-[11px] text-[#718096] block mt-0.5">{depot.city} ({depot.region})</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                      {depot.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#718096]">Stock actuel:</span>
                      <strong className="text-[#172033]">{depot.currentCasiers.toLocaleString('fr-FR')} casiers</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancy < 35 ? 'bg-red-500' : occupancy > 85 ? 'bg-amber-500' : 'bg-[#18a66a]'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Capacité: {depot.capacityCasiers.toLocaleString('fr-FR')}</span>
                      <span>{occupancy}% occupé</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#718096] flex items-center justify-between">
                  <span>Resp: <strong>{depot.manager}</strong></span>
                  <span className="text-[10px]">{depot.lastShipment}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Stock Table */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e4eaf2] flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-[#172033]">
              Inventaire Produits & Seuils d'Alerte
            </h2>
            <p className="text-[12px] text-[#718096]">Niveaux consolidés des casiers disponibles à la vente</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e4eaf2] text-[#718096] text-[11px] font-bold uppercase">
                <th className="py-3 px-4">Produit BRALIMA</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Format Casier</th>
                <th className="py-3 px-4 text-right">Prix Casier (CDF)</th>
                <th className="py-3 px-4 text-right">Stock Disponible</th>
                <th className="py-3 px-4 text-right">Seuil Minimal</th>
                <th className="py-3 px-4 text-center">Niveau</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1f6]">
              {products.map((p) => {
                const isCritical = p.stockUnits <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172033]">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#718096]">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.format}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#18a66a]">
                      {p.priceCDF.toLocaleString('fr-FR')} CDF
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#172033]">
                      {p.stockUnits.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {p.minStock.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCritical ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCritical ? 'Stock Bas' : 'Suffisant'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onRestockProduct(p.id, 1000)}
                        className="bg-slate-100 hover:bg-[#1769ff] hover:text-white text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
                        title="Ajouter 1000 casiers en réapprovisionnement"
                      >
                        +1 000 casiers
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Inter-Depot Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e4eaf2]">
            <h3 className="text-[18px] font-extrabold text-[#071b45] mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#1769ff]" />
              Ordre de Transfert Inter-Dépôts BRALIMA
            </h3>
            <p className="text-[12px] text-[#718096] mb-4">
              Planification des navettes d'approvisionnement entre les brasseries et dépôts régionaux
            </p>

            {transferSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-[13px] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{transferSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSimulateTransfer} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#172033] mb-1">Dépôt d'origine (Source)</label>
                  <select className="w-full p-2.5 border border-[#e4eaf2] rounded-lg text-[13px] bg-[#fafcff]">
                    <option>Usine Limete (Kinshasa) - 64 200 casiers disp.</option>
                    <option>Brasserie Lubumbashi - 48 500 casiers disp.</option>
                    <option>Brasserie Kisangani - 26 800 casiers disp.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#172033] mb-1">Dépôt de destination</label>
                  <select className="w-full p-2.5 border border-[#e4eaf2] rounded-lg text-[13px] bg-[#fafcff]">
                    <option>Dépôt Relais Kingabwa (Stock critique)</option>
                    <option>Dépôt Logistique Kananga (Kasaï-Central - Stock critique)</option>
                    <option>Dépôt Régional Goma (Nord-Kivu)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#172033] mb-1">Produit</label>
                    <select className="w-full p-2.5 border border-[#e4eaf2] rounded-lg text-[13px] bg-[#fafcff]">
                      <option>Primus 33cl (Casier de 24)</option>
                      <option>Castel Beer 50cl</option>
                      <option>Turbo King 65cl</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#172033] mb-1">Quantité (Casiers)</label>
                    <input
                      type="number"
                      defaultValue={1500}
                      className="w-full p-2.5 border border-[#e4eaf2] rounded-lg text-[13px] bg-[#fafcff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#172033] mb-1">Mode logistique d'acheminement</label>
                  <select className="w-full p-2.5 border border-[#e4eaf2] rounded-lg text-[13px] bg-[#fafcff]">
                    <option>Convoi Routier RN1 (Semi-remorques 30T)</option>
                    <option>Barge fluviale (Fleuve Congo)</option>
                    <option>Fret ferroviaire combiné (SNCC)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setTransferModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1769ff] hover:bg-[#1255d6] text-white rounded-lg text-[13px] font-bold shadow-md"
                  >
                    Valider le transfert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
