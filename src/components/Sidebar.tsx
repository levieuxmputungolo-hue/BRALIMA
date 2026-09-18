import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  Map,
  Users,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Settings,
  Layers,
  X
} from 'lucide-react';
import { ModuleType } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  incidentCount: number;
}

const NAV_ITEMS: { id: ModuleType; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'Tableau de bord', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'Commandes', label: 'Commandes', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'Stocks', label: 'Stocks', icon: <Package className="w-4 h-4" /> },
  { id: 'Livraisons', label: 'Livraisons', icon: <Truck className="w-4 h-4" /> },
  { id: 'Points de vente', label: 'Points de vente', icon: <MapPin className="w-4 h-4" /> },
  { id: 'Carte RDC', label: 'Carte RDC', icon: <Map className="w-4 h-4" /> },
  { id: 'Équipes commerciales', label: 'Équipes commerciales', icon: <Users className="w-4 h-4" /> },
  { id: 'Incidents', label: 'Incidents', icon: <AlertTriangle className="w-4 h-4" />, badge: 'urgent' },
  { id: 'Rapports', label: 'Rapports', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'IA & Analyses', label: 'IA & Analyses', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'ai' },
  { id: 'Architecture & API', label: 'Architecture & API', icon: <Layers className="w-4 h-4 text-emerald-400" />, badge: 'api' },
  { id: 'Paramètres', label: 'Paramètres', icon: <Settings className="w-4 h-4" /> }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  incidentCount
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 bottom-0 left-0 w-[245px] bg-gradient-to-b from-[#071b45] to-[#09295f] text-white py-[22px] px-[14px] z-40 transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-[10px] pb-[24px] border-b border-white/15">
            <div className="flex items-center gap-[10px]">
              <div
                id="brand-logo"
                className="w-[44px] h-[44px] rounded-[12px] bg-[#f4bd18] text-[#071b45] flex items-center justify-center text-[22px] font-black shadow-md shrink-0"
              >
                B
              </div>
              <div>
                <div className="text-[16px] font-bold tracking-tight text-white flex items-center gap-1.5">
                  BRALIMA DDC
                </div>
                <div className="text-[#b9c8e7] text-[10px] leading-tight mt-[3px]">
                  Digital Distribution<br />
                  Command Center
                </div>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              id="sidebar-close-btn"
              onClick={onCloseMobile}
              className="lg:hidden text-[#b9c8e7] hover:text-white p-1 rounded-md"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-[20px] space-y-[3px]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => {
                    onSelectModule(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left py-[11px] px-[13px] rounded-[10px] flex items-center justify-between text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold shadow-xs'
                      : 'text-[#dce6fb] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-[12px]">
                    <span className="w-[20px] flex items-center justify-center shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge === 'urgent' && incidentCount > 0 && (
                    <span className="bg-[#e5484d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {incidentCount}
                    </span>
                  )}

                  {item.badge === 'ai' && (
                    <span className="bg-[#f4bd18]/25 text-[#f4bd18] text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-[#f4bd18]/40">
                      GEMINI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live operational badge in footer of sidebar */}
        <div className="pt-4 border-t border-white/10 px-2 text-[11px] text-[#b9c8e7]">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#18a66a] animate-ping" />
              <span className="font-semibold text-white">Réseau RDC Actif</span>
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">6 Hubs</span>
          </div>
          <p className="text-[10px] text-[#8ea8d8] leading-tight">
            Kinshasa · Lubumbashi · Goma · Kananga · Kisangani · Matadi
          </p>
        </div>
      </aside>
    </>
  );
};
