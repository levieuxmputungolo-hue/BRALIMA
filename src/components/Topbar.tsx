import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { NotificationItem, OrderItem, PointOfSale, DepotStock, ProductItem, ModuleType } from '../types';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  notifications: NotificationItem[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  orders: OrderItem[];
  posList: PointOfSale[];
  depots: DepotStock[];
  products: ProductItem[];
  onNavigateTo: (module: ModuleType) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  orders,
  posList,
  depots,
  products,
  onNavigateTo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matchedPOS = query
    ? posList.filter((p) => p.name.toLowerCase().includes(query) || p.commune.toLowerCase().includes(query) || p.city.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const matchedOrders = query
    ? orders.filter((o) => o.id.toLowerCase().includes(query) || o.customerName.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const matchedDepots = query
    ? depots.filter((d) => d.name.toLowerCase().includes(query) || d.city.toLowerCase().includes(query)).slice(0, 2)
    : [];
  const matchedProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 2)
    : [];

  const hasResults = query && (matchedPOS.length > 0 || matchedOrders.length > 0 || matchedDepots.length > 0 || matchedProducts.length > 0);

  return (
    <header className="h-[76px] bg-white border-b border-[#e4eaf2] flex items-center gap-[20px] px-[20px] lg:px-[28px] sticky top-0 z-20 shadow-xs">
      {/* Mobile Menu Toggle Button */}
      <button
        id="topbar-mobile-menu-btn"
        onClick={onToggleMobileMenu}
        className="lg:hidden text-[#172033] hover:text-[#1769ff] p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Global Search Bar */}
      <div ref={searchRef} className="flex-1 max-w-[620px] relative">
        <span className="absolute left-[14px] top-[11px] text-[#718096] pointer-events-none">
          <Search className="w-[18px] h-[18px]" />
        </span>
        <input
          id="global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          placeholder="Rechercher un point de vente, une commande, un dépôt..."
          className="w-full py-[11px] pl-[40px] pr-[16px] border border-[#e4eaf2] rounded-[10px] outline-none bg-[#fafcff] focus:bg-white focus:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15 text-[13px] text-[#172033] transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Live Search Results Flyout */}
        {showSearchResults && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e4eaf2] overflow-hidden z-50 text-[13px]">
            {hasResults ? (
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2">
                {matchedPOS.length > 0 && (
                  <div className="py-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Points de Vente
                    </div>
                    {matchedPOS.map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => {
                          onNavigateTo('Points de vente');
                          setShowSearchResults(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#172033] group-hover:text-[#1769ff]">{pos.name}</div>
                          <div className="text-[11px] text-[#718096]">{pos.commune}, {pos.city} · {pos.type}</div>
                        </div>
                        <span className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {pos.weeklyCasiers} casiers/sem
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedOrders.length > 0 && (
                  <div className="py-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Commandes
                    </div>
                    {matchedOrders.map((ord) => (
                      <button
                        key={ord.id}
                        onClick={() => {
                          onNavigateTo('Commandes');
                          setShowSearchResults(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#172033] group-hover:text-[#1769ff]">{ord.id} — {ord.customerName}</div>
                          <div className="text-[11px] text-[#718096]">{ord.itemsSummary}</div>
                        </div>
                        <span className="text-[11px] font-bold text-[#1769ff]">
                          {ord.totalCDF.toLocaleString('fr-FR')} CDF
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedDepots.length > 0 && (
                  <div className="py-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Dépôts & Hubs
                    </div>
                    {matchedDepots.map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => {
                          onNavigateTo('Stocks');
                          setShowSearchResults(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#172033] group-hover:text-[#1769ff]">{dep.name}</div>
                          <div className="text-[11px] text-[#718096]">{dep.city} · Resp: {dep.manager}</div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          {dep.currentCasiers.toLocaleString('fr-FR')} casiers
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedProducts.length > 0 && (
                  <div className="py-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Produits BRALIMA
                    </div>
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onNavigateTo('Stocks');
                          setShowSearchResults(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#172033] group-hover:text-[#1769ff]">{p.name}</div>
                          <div className="text-[11px] text-[#718096]">{p.format} · {p.category}</div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          {p.priceCDF.toLocaleString('fr-FR')} CDF / casier
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                Aucun résultat trouvé pour "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topbar Right Icons & Profile */}
      <div className="ml-auto flex items-center gap-[18px] relative">
        {/* Notifications Button */}
        <div ref={notifRef} className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-[#172033] relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                id="notification-dot"
                className="absolute w-[8px] h-[8px] bg-[#e5484d] rounded-full right-2 top-2 ring-2 ring-white animate-pulse"
              />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[340px] sm:w-[380px] bg-white rounded-xl shadow-2xl border border-[#e4eaf2] z-50 overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-[#e4eaf2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#071b45] text-[13px]">Alertes & Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#1769ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-[11px] text-[#1769ff] hover:underline font-medium"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50/80 flex items-start gap-3 transition-colors">
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-[#e5484d]" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#18a66a]" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-[#1769ff]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-[#172033] leading-tight">{n.title}</div>
                        <p className="text-[11px] text-[#718096] mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                      <button
                        onClick={() => onDismissNotification(n.id)}
                        className="text-slate-300 hover:text-slate-500 p-1"
                        title="Masquer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-[12px]">
                    Aucune notification active.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <div
            id="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-[10px] cursor-pointer hover:opacity-90 transition-opacity p-1 rounded-lg"
          >
            <div
              id="avatar"
              className="w-[38px] h-[38px] rounded-full bg-[#dce8ff] flex justify-center items-center font-bold text-[13px] text-[#071b45] ring-2 ring-[#1769ff]/20"
            >
              AD
            </div>

            <div className="hidden sm:block">
              <b className="text-[12px] text-[#172033] block leading-tight">
                Administrateur
              </b>
              <small className="block text-[#718096] text-[10px] leading-tight">
                Direction Générale
              </small>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-[220px] bg-white rounded-xl shadow-xl border border-[#e4eaf2] p-2 z-50 text-[12px]">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-[#071b45]">Augustin Diomi</div>
                <div className="text-[10px] text-slate-500">augustin.diomi@bralima.cd</div>
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Session Sécurisée
                </span>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => {
                    onNavigateTo('Paramètres');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded text-slate-700 hover:text-[#1769ff]"
                >
                  Paramètres du DDC
                </button>
                <button
                  onClick={() => {
                    onNavigateTo('Rapports');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded text-slate-700 hover:text-[#1769ff]"
                >
                  Mes Rapports Hebdomadaires
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
