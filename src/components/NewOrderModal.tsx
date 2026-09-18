import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { OrderItem, ProductItem, RegionType, PointOfSale } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  posList: PointOfSale[];
  currentRegion: RegionType;
  onAddOrder: (order: OrderItem) => void;
  preselectedPos?: PointOfSale | null;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  posList,
  currentRegion,
  onAddOrder,
  preselectedPos
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(preselectedPos?.name || '');
  const [customerType, setCustomerType] = useState<OrderItem['customerType']>(
    (preselectedPos?.type as OrderItem['customerType']) || 'Terrasse / Bar'
  );
  const [region, setRegion] = useState<string>(
    preselectedPos?.region || (currentRegion === 'Toutes les régions' ? 'Kinshasa' : currentRegion)
  );
  const [paymentMode, setPaymentMode] = useState<OrderItem['paymentMode']>('M-Pesa');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedQuantity, setSelectedQuantity] = useState(50);
  const [orderItems, setOrderItems] = useState<{ product: ProductItem; quantity: number }[]>([
    { product: products[0], quantity: 50 }
  ]);

  const handleAddItem = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existing = orderItems.find((item) => item.product.id === prod.id);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === prod.id ? { ...item, quantity: item.quantity + selectedQuantity } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product: prod, quantity: selectedQuantity }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalCasiers = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAmountCDF = orderItems.reduce((acc, curr) => acc + curr.quantity * curr.product.priceCDF, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || orderItems.length === 0) return;

    const newOrder: OrderItem = {
      id: `CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      customerType,
      region,
      date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      itemsSummary: orderItems.map((item) => `${item.quantity} ${item.product.name}`).join(', '),
      casiersCount: totalCasiers,
      totalCDF: totalAmountCDF,
      status: 'Validée',
      paymentMode,
      driverAssigned: 'En cours d attribution'
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e4eaf2] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#eaf1ff] text-[#1769ff] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#071b45] text-[17px]">Nouvelle Commande BRALIMA</h3>
              <p className="text-[11px] text-[#718096]">Saisie directe pour livraison express</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#172033] mb-1">Établissement / Client</label>
              <input
                type="text"
                required
                placeholder="Ex: Nganda Chez Ntemba"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1">Type d'Établissement</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as any)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              >
                <option value="Terrasse / Bar">Terrasse / Bar</option>
                <option value="Grossiste">Grossiste</option>
                <option value="Dépôt Relais">Dépôt Relais</option>
                <option value="Supermarché">Supermarché</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#172033] mb-1">Région de Livraison</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              >
                <option value="Kinshasa">Kinshasa</option>
                <option value="Lubumbashi">Lubumbashi</option>
                <option value="Goma">Goma</option>
                <option value="Kananga">Kananga</option>
                <option value="Kisangani">Kisangani</option>
                <option value="Matadi">Matadi</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1">Mode de Paiement</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#1769ff]"
              >
                <option value="M-Pesa">M-Pesa (Vodacom)</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Virement BCDC">Virement BCDC / Rawbank</option>
                <option value="Espèces">Espèces à la livraison</option>
              </select>
            </div>
          </div>

          {/* Add product line */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block font-bold text-[#172033] mb-2 text-[12px]">Ajouter des casiers :</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 p-2 border border-[#e4eaf2] rounded-lg bg-white text-[12px]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.priceCDF.toLocaleString('fr-FR')} CDF)
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="5"
                max="2000"
                step="5"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-[#e4eaf2] rounded-lg bg-white text-[12px] text-center font-bold"
              />

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-[#1769ff] hover:bg-[#1255d6] text-white p-2 rounded-lg text-[12px] font-bold shrink-0 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>

          {/* Current order lines */}
          <div className="space-y-2">
            <span className="block font-bold text-[#172033] text-[12px]">Articles commandés :</span>
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-[12px]">
                <div>
                  <strong className="text-[#172033]">{item.quantity} casiers</strong> — {item.product.name}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#18a66a] font-bold">
                    {(item.quantity * item.product.priceCDF).toLocaleString('fr-FR')} CDF
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Bar */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#718096] block">Volume total:</span>
              <strong className="text-[16px] text-[#071b45]">{totalCasiers} casiers</strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#718096] block">Montant à encaisser :</span>
              <strong className="text-[18px] font-mono text-[#1769ff]">
                {totalAmountCDF.toLocaleString('fr-FR')} CDF
              </strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={orderItems.length === 0 || !customerName.trim()}
              className="px-5 py-2 bg-[#1769ff] hover:bg-[#1255d6] text-white rounded-xl text-[13px] font-bold shadow-md transition-colors disabled:opacity-50"
            >
              Confirmer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
