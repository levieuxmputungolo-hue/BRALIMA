export type ModuleType =
  | 'Tableau de bord'
  | 'Commandes'
  | 'Stocks'
  | 'Livraisons'
  | 'Points de vente'
  | 'Carte RDC'
  | 'Équipes commerciales'
  | 'Incidents'
  | 'Rapports'
  | 'IA & Analyses'
  | 'Architecture & API'
  | 'Paramètres';

export type RegionType =
  | 'Toutes les régions'
  | 'Kinshasa'
  | 'Lubumbashi'
  | 'Goma'
  | 'Kananga'
  | 'Kisangani'
  | 'Matadi';

export interface ProductItem {
  id: string;
  name: string;
  brand: 'Primus' | 'Castel' | 'Turbo King' | 'Tango' | 'Appetiser' | 'Muttzig' | 'Maltina' | 'Vitalo';
  format: string; // e.g., '33cl', '50cl', '65cl'
  casiersSold: number;
  trend: string;
  trendPositive: boolean;
  priceCDF: number;
  stockUnits: number;
  minStock: number;
  category: 'Bière' | 'Boisson Gazeuse' | 'Boisson Maltée';
}

export interface IncidentItem {
  id: string;
  title: string;
  timeAgo: string;
  location: string;
  region: string;
  severity: 'Urgent' | 'À suivre' | 'Résolu';
  description: string;
  assignedTo?: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerType: 'Grossiste' | 'Terrasse / Bar' | 'Dépôt Relais' | 'Supermarché' | 'Hôtel Restaurant' | 'Nganda / Terrasse' | 'Bar Moderne';
  region: string;
  date: string;
  itemsSummary: string;
  casiersCount: number;
  totalCDF: number;
  status: 'Validée' | 'En préparation' | 'En transit' | 'Livrée' | 'Bloquée';
  paymentMode: 'Airtel Money' | 'M-Pesa' | 'Orange Money' | 'Virement BCDC' | 'Espèces';
  driverAssigned?: string;
}

export interface DepotStock {
  id: string;
  name: string;
  city: string;
  region: string;
  capacityCasiers: number;
  currentCasiers: number;
  status: 'Optimal' | 'Vigilance' | 'Critique';
  manager: string;
  lastShipment: string;
}

export interface DeliveryTrip {
  id: string;
  truckPlate: string;
  driverName: string;
  destination: string;
  region: string;
  cargo: string;
  casiersCount: number;
  status: 'En route' | 'Chargement' | 'Arrivé' | 'Retardé';
  departureTime: string;
  eta: string;
  progressPercent: number;
}

export interface PointOfSale {
  id: string;
  name: string;
  type: 'Nganda / Terrasse' | 'Bar Moderne' | 'Dépôt Grossiste' | 'Hôtel Restaurant' | 'Supérette';
  commune: string;
  city: string;
  region: string;
  owner: string;
  phone: string;
  weeklyCasiers: number;
  status: 'Actif' | 'En attente' | 'Inactif';
  creditStatus: 'À jour' | 'Plafond 75%' | 'Bloqué';
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  zone: string;
  region: string;
  phone: string;
  monthlyTargetCasiers: number;
  achievedCasiers: number;
  posVisited: number;
  satisfactionRate: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}
