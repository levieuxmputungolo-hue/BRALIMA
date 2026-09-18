import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, Filter, CheckCircle2, Clock, Truck, AlertCircle, FileText } from 'lucide-react';
import { OrderItem, RegionType } from '../types';

interface OrdersViewProps {
  orders: OrderItem[];
  onOpenNewOrder: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderItem['status']) => void;
  currentRegion: RegionType;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenNewOrder,
  onUpdateOrderStatus,
  currentRegion
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesRegion = currentRegion === 'Toutes les régions' || order.region === currentRegion;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.itemsSummary.toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  const totalAmountCDF = filteredOrders.reduce((acc, curr) => acc + curr.totalCDF, 0);
  const totalCasiers = filteredOrders.reduce((acc, curr) => acc + curr.casiersCount, 0);

  return (
    <div className="space-y-[20px]">
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Gestion des Commandes — {currentRegion}
          </h1>
          <p className="text-[#718096] text-[13px] mt-[4px]">
            Flux de distribution, validation des paiements et assignation des tournées logistiques
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="bg-[#1769ff] hover:bg-[#1255d6] text-white text-[13px] font-semibold py-[10px] px-[16px] rounded-[10px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une commande</span>
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Commandes affichées</span>
          <div className="text-[20px] font-bold text-[#172033] mt-1">{filteredOrders.length}</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Volume total (Casiers)</span>
          <div className="text-[20px] font-bold text-[#1769ff] mt-1">{totalCasiers.toLocaleString('fr-FR')}</div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">Valeur marchande</span>
          <div className="text-[20px] font-bold text-[#18a66a] mt-1">
            {(totalAmountCDF / 1000000).toFixed(2)} M CDF
          </div>
        </div>
        <div className="bg-white border border-[#e4eaf2] p-3.5 rounded-xl shadow-xs">
          <span className="text-[#718096] text-[11px] font-medium block">En cours de livraison</span>
          <div className="text-[20px] font-bold text-amber-600 mt-1">
            {filteredOrders.filter((o) => o.status === 'En transit').length}
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Tabs */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par client, n° commande, produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[#e4eaf2] rounded-lg outline-none focus:border-[#1769ff] bg-[#fafcff]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          {['all', 'Validée', 'En préparation', 'En transit', 'Livrée', 'Bloquée'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#071b45] text-white font-semibold'
                  : 'bg-slate-50 text-[#718096] hover:bg-slate-100 hover:text-[#172033]'
              }`}
            >
              {status === 'all' ? 'Toutes' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#e4eaf2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e4eaf2] text-[#718096] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Client / Établissement</th>
                <th className="py-3 px-4">Région</th>
                <th className="py-3 px-4">Détails articles</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4 text-right">Montant CDF</th>
                <th className="py-3 px-4">Paiement</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1f6]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusBadgeColor =
                    order.status === 'Livrée' ? 'bg-[#e7f8ef] text-[#138052]' :
                    order.status === 'En transit' ? 'bg-[#eaf1ff] text-[#1769ff]' :
                    order.status === 'En préparation' ? 'bg-amber-50 text-amber-700' :
                    order.status === 'Validée' ? 'bg-blue-50 text-blue-700' :
                    'bg-[#ffe8e9] text-[#c93239]';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1769ff]">
                        {order.id}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">{order.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#172033]">
                        {order.customerName}
                        <span className="block text-[11px] text-[#718096] font-normal">{order.customerType}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#718096]">
                        {order.region}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-[220px] truncate" title={order.itemsSummary}>
                        {order.itemsSummary}
                        {order.driverAssigned && (
                          <span className="block text-[10px] text-slate-400 truncate">
                            🚚 {order.driverAssigned}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#172033]">
                        {order.casiersCount} <span className="text-[10px] text-slate-400 font-normal">cas.</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#18a66a]">
                        {order.totalCDF.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {order.paymentMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block py-1 px-2.5 rounded-full text-[10px] font-bold ${statusBadgeColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {order.status === 'Validée' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'En préparation')}
                              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 rounded"
                              title="Passer en préparation"
                            >
                              Préparer
                            </button>
                          )}
                          {order.status === 'En préparation' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'En transit')}
                              className="text-[11px] bg-blue-100 hover:bg-blue-200 text-[#1769ff] font-semibold px-2 py-1 rounded flex items-center gap-1"
                              title="Départ en livraison"
                            >
                              <Truck className="w-3 h-3" /> Expédier
                            </button>
                          )}
                          {order.status === 'En transit' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Livrée')}
                              className="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold px-2 py-1 rounded flex items-center gap-1"
                              title="Valider la réception"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Livrer
                            </button>
                          )}
                          {order.status === 'Livrée' && (
                            <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-0.5 justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Clôturée
                            </span>
                          )}
                          {order.status === 'Bloquée' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Validée')}
                              className="text-[11px] bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-2 py-1 rounded"
                              title="Débloquer la commande"
                            >
                              Débloquer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Aucune commande ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
