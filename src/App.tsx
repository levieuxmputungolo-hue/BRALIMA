import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { StocksView } from './components/StocksView';
import { DeliveriesView } from './components/DeliveriesView';
import { PointsOfSaleView } from './components/PointsOfSaleView';
import { RdcMapView } from './components/RdcMapView';
import { SalesTeamsView } from './components/SalesTeamsView';
import { IncidentsView } from './components/IncidentsView';
import { ReportsView } from './components/ReportsView';
import { AiAnalysisView } from './components/AiAnalysisView';
import { ArchitectureView } from './components/ArchitectureView';
import { SettingsView } from './components/SettingsView';
import { NewOrderModal } from './components/NewOrderModal';
import { NewIncidentModal } from './components/NewIncidentModal';

import {
  ModuleType,
  RegionType,
  ProductItem,
  IncidentItem,
  OrderItem,
  DepotStock,
  DeliveryTrip,
  PointOfSale,
  SalesRep,
  NotificationItem
} from './types';

import {
  INITIAL_PRODUCTS,
  INITIAL_INCIDENTS,
  INITIAL_ORDERS,
  INITIAL_DEPOTS,
  INITIAL_TRIPS,
  INITIAL_POS,
  INITIAL_SALES_REPS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

export default function App() {
  // Navigation & Region State
  const [currentModule, setCurrentModule] = useState<ModuleType>('Tableau de bord');
  const [currentRegion, setCurrentRegion] = useState<RegionType>('Kinshasa');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [depots, setDepots] = useState<DepotStock[]>(INITIAL_DEPOTS);
  const [trips, setTrips] = useState<DeliveryTrip[]>(INITIAL_TRIPS);
  const [posList, setPosList] = useState<PointOfSale[]>(INITIAL_POS);
  const [salesReps] = useState<SalesRep[]>(INITIAL_SALES_REPS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modal States
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [preselectedPos, setPreselectedPos] = useState<PointOfSale | null>(null);

  // Handler: Open Order Modal with optional POS
  const handleOpenNewOrder = (pos?: PointOfSale) => {
    setPreselectedPos(pos || null);
    setIsNewOrderOpen(true);
  };

  // Handler: Add New Order
  const handleAddOrder = (newOrder: OrderItem) => {
    setOrders([newOrder, ...orders]);
    // Notify
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Nouvelle Commande ${newOrder.id}`,
      message: `${newOrder.customerName} a commandé ${newOrder.casiersCount} casiers (${newOrder.totalCDF.toLocaleString('fr-FR')} CDF).`,
      time: 'À l instant',
      type: 'success',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handler: Update Order Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Handler: Add New Incident
  const handleAddIncident = (newIncident: IncidentItem) => {
    setIncidents([newIncident, ...incidents]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Alerte : ${newIncident.title}`,
      message: `${newIncident.location} (${newIncident.region}) - ${newIncident.severity}`,
      time: 'À l instant',
      type: 'alert',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handler: Mark Incident as Resolved
  const handleResolveIncident = (id: string) => {
    setIncidents(
      incidents.map((inc) => (inc.id === id ? { ...inc, severity: 'Résolu' } : inc))
    );
  };

  // Handler: Update Delivery Trip Status
  const handleUpdateTripStatus = (tripId: string, status: DeliveryTrip['status']) => {
    setTrips(
      trips.map((t) =>
        t.id === tripId ? { ...t, status, progressPercent: status === 'Arrivé' ? 100 : t.progressPercent } : t
      )
    );
  };

  // Handler: Restock Product
  const handleRestockProduct = (productId: string, addedUnits: number) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, stockUnits: p.stockUnits + addedUnits } : p
      )
    );
  };

  // Notification handlers
  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const urgentIncidentsCount = incidents.filter((i) => i.severity === 'Urgent').length;

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172033] font-sans antialiased flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        incidentCount={urgentIncidentsCount}
      />

      {/* Main App Layout */}
      <div className="lg:pl-[245px] flex-1 flex flex-col transition-all">
        {/* Topbar Header */}
        <Topbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
          orders={orders}
          posList={posList}
          depots={depots}
          products={products}
          onNavigateTo={(mod) => setCurrentModule(mod)}
        />

        {/* Dynamic Main View Content Area */}
        <main className="flex-1 p-[16px] sm:p-[20px] lg:p-[28px] max-w-[1600px] w-full mx-auto">
          {currentModule === 'Tableau de bord' && (
            <DashboardView
              currentRegion={currentRegion}
              onChangeRegion={setCurrentRegion}
              products={products}
              incidents={incidents}
              onOpenNewOrder={() => handleOpenNewOrder()}
              onOpenNewIncident={() => setIsNewIncidentOpen(true)}
              onNavigateTo={setCurrentModule}
              onResolveIncident={handleResolveIncident}
            />
          )}

          {currentModule === 'Commandes' && (
            <OrdersView
              orders={orders}
              onOpenNewOrder={() => handleOpenNewOrder()}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              currentRegion={currentRegion}
            />
          )}

          {currentModule === 'Stocks' && (
            <StocksView
              depots={depots}
              products={products}
              currentRegion={currentRegion}
              onRestockProduct={handleRestockProduct}
            />
          )}

          {currentModule === 'Livraisons' && (
            <DeliveriesView
              trips={trips}
              currentRegion={currentRegion}
              onUpdateTripStatus={handleUpdateTripStatus}
            />
          )}

          {currentModule === 'Points de vente' && (
            <PointsOfSaleView
              posList={posList}
              currentRegion={currentRegion}
              onSelectPosForOrder={(pos) => handleOpenNewOrder(pos)}
            />
          )}

          {currentModule === 'Carte RDC' && (
            <RdcMapView
              currentRegion={currentRegion}
              onChangeRegion={setCurrentRegion}
            />
          )}

          {currentModule === 'Équipes commerciales' && (
            <SalesTeamsView
              salesReps={salesReps}
              currentRegion={currentRegion}
            />
          )}

          {currentModule === 'Incidents' && (
            <IncidentsView
              incidents={incidents}
              currentRegion={currentRegion}
              onOpenNewIncident={() => setIsNewIncidentOpen(true)}
              onResolveIncident={handleResolveIncident}
            />
          )}

          {currentModule === 'Rapports' && (
            <ReportsView
              currentRegion={currentRegion}
              products={products}
            />
          )}

          {currentModule === 'IA & Analyses' && (
            <AiAnalysisView
              currentRegion={currentRegion}
              products={products}
              depots={depots}
              incidents={incidents}
            />
          )}

          {currentModule === 'Architecture & API' && (
            <ArchitectureView />
          )}

          {currentModule === 'Paramètres' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => {
          setIsNewOrderOpen(false);
          setPreselectedPos(null);
        }}
        products={products}
        posList={posList}
        currentRegion={currentRegion}
        onAddOrder={handleAddOrder}
        preselectedPos={preselectedPos}
      />

      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        currentRegion={currentRegion}
        onAddIncident={handleAddIncident}
      />
    </div>
  );
}
