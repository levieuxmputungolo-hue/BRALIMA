import {
  ProductItem,
  IncidentItem,
  OrderItem,
  DepotStock,
  DeliveryTrip,
  PointOfSale,
  SalesRep,
  NotificationItem
} from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Primus 33cl',
    brand: 'Primus',
    format: '33cl (Casier de 24)',
    casiersSold: 428560,
    trend: '↗ +12%',
    trendPositive: true,
    priceCDF: 28000,
    stockUnits: 14520,
    minStock: 5000,
    category: 'Bière'
  },
  {
    id: 'prod-2',
    name: 'Castel Beer 50cl',
    brand: 'Castel',
    format: '50cl (Casier de 20)',
    casiersSold: 312780,
    trend: '↗ +9%',
    trendPositive: true,
    priceCDF: 32500,
    stockUnits: 9800,
    minStock: 4000,
    category: 'Bière'
  },
  {
    id: 'prod-3',
    name: 'Turbo King 65cl',
    brand: 'Turbo King',
    format: '65cl (Casier de 12)',
    casiersSold: 245100,
    trend: '↗ +11%',
    trendPositive: true,
    priceCDF: 29000,
    stockUnits: 6200,
    minStock: 3000,
    category: 'Bière'
  },
  {
    id: 'prod-4',
    name: 'Tango 50cl',
    brand: 'Tango',
    format: '50cl (Casier de 20)',
    casiersSold: 198450,
    trend: '↗ +7%',
    trendPositive: true,
    priceCDF: 27500,
    stockUnits: 4100,
    minStock: 3500,
    category: 'Bière'
  },
  {
    id: 'prod-5',
    name: 'Appetiser 33cl',
    brand: 'Appetiser',
    format: '33cl (Casier de 24)',
    casiersSold: 124320,
    trend: '↗ +6%',
    trendPositive: true,
    priceCDF: 26000,
    stockUnits: 3400,
    minStock: 2500,
    category: 'Boisson Gazeuse'
  },
  {
    id: 'prod-6',
    name: 'Muttzig 50cl',
    brand: 'Muttzig',
    format: '50cl (Casier de 20)',
    casiersSold: 165800,
    trend: '↗ +8.5%',
    trendPositive: true,
    priceCDF: 34000,
    stockUnits: 2800,
    minStock: 3000,
    category: 'Bière'
  },
  {
    id: 'prod-7',
    name: 'Maltina Canette',
    brand: 'Maltina',
    format: '33cl (Plateau de 24)',
    casiersSold: 98400,
    trend: '↗ +14%',
    trendPositive: true,
    priceCDF: 31000,
    stockUnits: 5100,
    minStock: 2000,
    category: 'Boisson Maltée'
  },
  {
    id: 'prod-8',
    name: 'Vitalo Citron 30cl',
    brand: 'Vitalo',
    format: '30cl (Casier de 24)',
    casiersSold: 84200,
    trend: '↘ -2%',
    trendPositive: false,
    priceCDF: 22000,
    stockUnits: 3900,
    minStock: 2500,
    category: 'Boisson Gazeuse'
  }
];

export const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'inc-101',
    title: 'Rupture de stock — Primus 50cl',
    timeAgo: 'Il y a 2 h',
    location: 'Dépôt Limete Hub',
    region: 'Kinshasa',
    severity: 'Urgent',
    description: 'Niveau inférieur à 200 casiers suite à un pic de commandes sur Bandalungwa et Matonge.',
    assignedTo: 'Jean-Paul Maluku (Superviseur)'
  },
  {
    id: 'inc-102',
    title: 'Retard de livraison — Kasaï',
    timeAgo: 'Il y a 4 h',
    location: 'Axe Kananga - Mbuji-Mayi (RN1)',
    region: 'Kananga',
    severity: 'À suivre',
    description: 'Camion grumier en panne d essieu bloquant le convoi de 800 casiers sur le tronçon boueux.',
    assignedTo: 'Alain Tshilombo (Logistique Kasaï)'
  },
  {
    id: 'inc-103',
    title: 'Livraison confirmée — Dépôt Ruashi',
    timeAgo: 'Il y a 6 h',
    location: 'Lubumbashi Centre',
    region: 'Lubumbashi',
    severity: 'Résolu',
    description: '1 500 casiers Castel & Primus déchargés et visés sans écart d inventaire.',
    assignedTo: 'Grace Mutombo'
  },
  {
    id: 'inc-104',
    title: 'Barge fluviale M/B Congo King en accostage',
    timeAgo: 'Il y a 8 h',
    location: 'Port de Kisangani',
    region: 'Kisangani',
    severity: 'À suivre',
    description: 'Arrivage de 4 200 casiers en provenance de Kinshasa, inspection sanitaire en cours.',
    assignedTo: 'Michel Bopili'
  },
  {
    id: 'inc-105',
    title: 'Écart de casse verre retourné',
    timeAgo: 'Il y a 1 j',
    location: 'Dépôt Matadi Ville',
    region: 'Matadi',
    severity: 'Résolu',
    description: 'Rapprochement des fûts et emballages verre validé avec le grossiste partenaire.',
    assignedTo: 'Patrick Mbemba'
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'CMD-2026-9842',
    customerName: 'Terrasse Chez Ntemba & Frères',
    customerType: 'Terrasse / Bar',
    region: 'Kinshasa',
    date: '17/09/2026 14:20',
    itemsSummary: '120 casiers Primus 33cl, 40 Castel 50cl',
    casiersCount: 160,
    totalCDF: 4660000,
    status: 'En transit',
    paymentMode: 'M-Pesa',
    driverAssigned: 'Kabila Mwamba (Camion KIN-840)'
  },
  {
    id: 'CMD-2026-9841',
    customerName: 'Établissements Kasaï Express',
    customerType: 'Grossiste',
    region: 'Kananga',
    date: '17/09/2026 13:45',
    itemsSummary: '450 casiers Primus, 200 Turbo King',
    casiersCount: 650,
    totalCDF: 18400000,
    status: 'En préparation',
    paymentMode: 'Virement BCDC',
    driverAssigned: 'En attente d affectation'
  },
  {
    id: 'CMD-2026-9840',
    customerName: 'Grand Hôtel Karisimbi Bar',
    customerType: 'Hôtel Restaurant',
    region: 'Goma',
    date: '17/09/2026 12:10',
    itemsSummary: '60 casiers Muttzig, 40 Appetiser, 30 Maltina',
    casiersCount: 130,
    totalCDF: 4010000,
    status: 'Livrée',
    paymentMode: 'Airtel Money',
    driverAssigned: 'Baraka Ndungutse'
  },
  {
    id: 'CMD-2026-9839',
    customerName: 'Nganda Victoire Kalamu',
    customerType: 'Terrasse / Bar',
    region: 'Kinshasa',
    date: '17/09/2026 11:30',
    itemsSummary: '80 casiers Primus 33cl, 20 Turbo King',
    casiersCount: 100,
    totalCDF: 2820000,
    status: 'Validée',
    paymentMode: 'Orange Money'
  },
  {
    id: 'CMD-2026-9838',
    customerName: 'Comptoir Katanga Beverage',
    customerType: 'Grossiste',
    region: 'Lubumbashi',
    date: '17/09/2026 10:15',
    itemsSummary: '800 casiers Castel Beer 50cl',
    casiersCount: 800,
    totalCDF: 26000000,
    status: 'En transit',
    paymentMode: 'Virement BCDC',
    driverAssigned: 'Serge Ilunga (Semi-remorque LSH-110)'
  },
  {
    id: 'CMD-2026-9837',
    customerName: 'Alimentation Centrale de Matadi',
    customerType: 'Supermarché',
    region: 'Matadi',
    date: '17/09/2026 09:05',
    itemsSummary: '50 casiers Vitalo, 50 Maltina, 50 Primus',
    casiersCount: 150,
    totalCDF: 4050000,
    status: 'Livrée',
    paymentMode: 'Espèces',
    driverAssigned: 'Dieudonné Mavungu'
  },
  {
    id: 'CMD-2026-9836',
    customerName: 'Nganda Le Baobab Kisangani',
    customerType: 'Terrasse / Bar',
    region: 'Kisangani',
    date: '17/09/2026 08:30',
    itemsSummary: '110 casiers Primus 50cl',
    casiersCount: 110,
    totalCDF: 3080000,
    status: 'Bloquée',
    paymentMode: 'Airtel Money',
    driverAssigned: 'Suspendue (En attente d encaissement)'
  }
];

export const INITIAL_DEPOTS: DepotStock[] = [
  {
    id: 'dep-kin-1',
    name: 'Usine & Hub Principal de Limete',
    city: 'Kinshasa',
    region: 'Kinshasa',
    capacityCasiers: 85000,
    currentCasiers: 64200,
    status: 'Optimal',
    manager: 'M. Augustin Kalala',
    lastShipment: 'Aujourd hui à 13:45'
  },
  {
    id: 'dep-kin-2',
    name: 'Dépôt Relais Kingabwa',
    city: 'Kinshasa',
    region: 'Kinshasa',
    capacityCasiers: 30000,
    currentCasiers: 8400,
    status: 'Critique',
    manager: 'Mme Chantal Yombo',
    lastShipment: 'Hier à 18:00'
  },
  {
    id: 'dep-lsh',
    name: 'Brasserie BRALIMA Lubumbashi',
    city: 'Lubumbashi',
    region: 'Lubumbashi',
    capacityCasiers: 60000,
    currentCasiers: 48500,
    status: 'Optimal',
    manager: 'M. Moïse Katuta',
    lastShipment: 'Aujourd hui à 11:20'
  },
  {
    id: 'dep-gom',
    name: 'Dépôt Régional Grand Kivu (Goma)',
    city: 'Goma',
    region: 'Goma',
    capacityCasiers: 25000,
    currentCasiers: 14200,
    status: 'Vigilance',
    manager: 'M. Innocent Bahati',
    lastShipment: 'Aujourd hui à 09:10'
  },
  {
    id: 'dep-kan',
    name: 'Dépôt Logistique Kananga',
    city: 'Kananga',
    region: 'Kananga',
    capacityCasiers: 20000,
    currentCasiers: 6100,
    status: 'Critique',
    manager: 'M. Félix Mukendi',
    lastShipment: 'Il y a 2 jours'
  },
  {
    id: 'dep-kis',
    name: 'Brasserie BRALIMA Kisangani',
    city: 'Kisangani',
    region: 'Kisangani',
    capacityCasiers: 35000,
    currentCasiers: 26800,
    status: 'Optimal',
    manager: 'M. Roger Botamba',
    lastShipment: 'Hier à 16:30'
  },
  {
    id: 'dep-mat',
    name: 'Hub Maritime & Portuaire de Boma/Matadi',
    city: 'Matadi',
    region: 'Matadi',
    capacityCasiers: 30000,
    currentCasiers: 19700,
    status: 'Vigilance',
    manager: 'M. Thomas Vangu',
    lastShipment: 'Aujourd hui à 08:00'
  }
];

export const INITIAL_TRIPS: DeliveryTrip[] = [
  {
    id: 'TRP-1044',
    truckPlate: 'KIN-9042-BG',
    driverName: 'Kabila Mwamba',
    destination: 'Bandalungwa & Kintambo',
    region: 'Kinshasa',
    cargo: '160 casiers Primus & Castel',
    casiersCount: 160,
    status: 'En route',
    departureTime: '13:30',
    eta: '15:15',
    progressPercent: 70
  },
  {
    id: 'TRP-1043',
    truckPlate: 'LSH-4412-BB',
    driverName: 'Serge Ilunga',
    destination: 'Kenya & Kamalondo',
    region: 'Lubumbashi',
    cargo: '800 casiers Castel 50cl',
    casiersCount: 800,
    status: 'En route',
    departureTime: '11:00',
    eta: '16:00',
    progressPercent: 60
  },
  {
    id: 'TRP-1042',
    truckPlate: 'GOM-2190-AA',
    driverName: 'Baraka Ndungutse',
    destination: 'Axe Himbi - Majengo',
    region: 'Goma',
    cargo: '240 casiers Muttzig & Vitalo',
    casiersCount: 240,
    status: 'Arrivé',
    departureTime: '08:45',
    eta: '12:30',
    progressPercent: 100
  },
  {
    id: 'TRP-1041',
    truckPlate: 'KAN-8812-CC',
    driverName: 'Donat Tshiondo',
    destination: 'Axe Tshimbulu (RN1)',
    region: 'Kananga',
    cargo: '320 casiers Primus 33cl',
    casiersCount: 320,
    status: 'Retardé',
    departureTime: '07:00',
    eta: '17:30 (Retard voie)',
    progressPercent: 40
  },
  {
    id: 'TRP-1040',
    truckPlate: 'BARGE-FLEUVE-04',
    driverName: 'Capitaine Mbuyi (Barge)',
    destination: 'Relais Mbandaka - Kisangani',
    region: 'Kisangani',
    cargo: '3 500 casiers assortis',
    casiersCount: 3500,
    status: 'En route',
    departureTime: 'Hier',
    eta: 'Demain 14:00',
    progressPercent: 85
  }
];

export const INITIAL_POS: PointOfSale[] = [
  {
    id: 'pos-1',
    name: 'Terrasse Chez Ntemba',
    type: 'Nganda / Terrasse',
    commune: 'Bandalungwa',
    city: 'Kinshasa',
    region: 'Kinshasa',
    owner: 'Ntemba Jean',
    phone: '+243 81 500 1234',
    weeklyCasiers: 320,
    status: 'Actif',
    creditStatus: 'À jour'
  },
  {
    id: 'pos-2',
    name: 'Nganda Le Relais Victoire',
    type: 'Bar Moderne',
    commune: 'Matonge / Kalamu',
    city: 'Kinshasa',
    region: 'Kinshasa',
    owner: 'Mama Marie Kiese',
    phone: '+243 89 222 3456',
    weeklyCasiers: 280,
    status: 'Actif',
    creditStatus: 'À jour'
  },
  {
    id: 'pos-3',
    name: 'Dépôt Grossiste Simba Katanga',
    type: 'Dépôt Grossiste',
    commune: 'Kenya',
    city: 'Lubumbashi',
    region: 'Lubumbashi',
    owner: 'Ets. Kabongo & Fils',
    phone: '+243 97 444 8899',
    weeklyCasiers: 1400,
    status: 'Actif',
    creditStatus: 'Plafond 75%'
  },
  {
    id: 'pos-4',
    name: 'Kivu Lounge & Terrace',
    type: 'Hôtel Restaurant',
    commune: 'Goma Centre',
    city: 'Goma',
    region: 'Goma',
    owner: 'Dieudonné Mugisho',
    phone: '+243 82 777 6543',
    weeklyCasiers: 190,
    status: 'Actif',
    creditStatus: 'À jour'
  },
  {
    id: 'pos-5',
    name: 'Supermarché Kin-Mart Gombe',
    type: 'Supérette',
    commune: 'Gombe',
    city: 'Kinshasa',
    region: 'Kinshasa',
    owner: 'Direction Kin-Mart',
    phone: '+243 81 999 0011',
    weeklyCasiers: 220,
    status: 'Actif',
    creditStatus: 'À jour'
  },
  {
    id: 'pos-6',
    name: 'Terrasse La Patience Kananga',
    type: 'Nganda / Terrasse',
    commune: 'Nganza',
    city: 'Kananga',
    region: 'Kananga',
    owner: 'Anaclet Ntumba',
    phone: '+243 84 333 2110',
    weeklyCasiers: 85,
    status: 'En attente',
    creditStatus: 'Bloqué'
  },
  {
    id: 'pos-7',
    name: 'Bar Panorama Fleuve',
    type: 'Bar Moderne',
    commune: 'Makiso',
    city: 'Kisangani',
    region: 'Kisangani',
    owner: 'Clément Lokonda',
    phone: '+243 85 112 3344',
    weeklyCasiers: 160,
    status: 'Actif',
    creditStatus: 'À jour'
  }
];

export const INITIAL_SALES_REPS: SalesRep[] = [
  {
    id: 'rep-1',
    name: 'Patrick Bofenda',
    role: 'Superviseur RTM (Route-to-Market)',
    zone: 'Kinshasa Ouest (Bandal, Kintambo, Ngaliema)',
    region: 'Kinshasa',
    phone: '+243 81 400 9011',
    monthlyTargetCasiers: 45000,
    achievedCasiers: 42100,
    posVisited: 142,
    satisfactionRate: 96
  },
  {
    id: 'rep-2',
    name: 'Dorcas Ilunga',
    role: 'Déléguée Commerciale On-Trade',
    zone: 'Kinshasa Est (Tshangu, Masina, Kimbanseke)',
    region: 'Kinshasa',
    phone: '+243 82 300 8822',
    monthlyTargetCasiers: 52000,
    achievedCasiers: 54300,
    posVisited: 168,
    satisfactionRate: 98
  },
  {
    id: 'rep-3',
    name: 'Freddy Kalombwe',
    role: 'Superviseur Zone Katanga',
    zone: 'Lubumbashi Urbain & Périphérie',
    region: 'Lubumbashi',
    phone: '+243 99 770 1234',
    monthlyTargetCasiers: 40000,
    achievedCasiers: 37800,
    posVisited: 110,
    satisfactionRate: 92
  },
  {
    id: 'rep-4',
    name: 'Aline Zawadi',
    role: 'Déléguée Commerciale Kivu',
    zone: 'Goma, Sake, Rutshuru',
    region: 'Goma',
    phone: '+243 85 550 4433',
    monthlyTargetCasiers: 22000,
    achievedCasiers: 21900,
    posVisited: 85,
    satisfactionRate: 94
  },
  {
    id: 'rep-5',
    name: 'Emmanuel Mukala',
    role: 'Coordonnateur Réseau Kasaï',
    zone: 'Kananga & Axe ferroviaire Ilebo',
    region: 'Kananga',
    phone: '+243 81 600 7711',
    monthlyTargetCasiers: 18000,
    achievedCasiers: 14200,
    posVisited: 64,
    satisfactionRate: 88
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Alerte Seuil Dépôt Kingabwa',
    message: 'Stock Primus 50cl sous le seuil critique (280 casiers restants).',
    time: 'Il y a 15 min',
    type: 'alert',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Commande validée M-Pesa',
    message: 'Terrasse Chez Ntemba a réglé 4 660 000 CDF via M-Pesa.',
    time: 'Il y a 45 min',
    type: 'success',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Convoi barge fluviale Kisangani',
    message: 'La barge fluviale avec 3 500 casiers a dépassé Mbandaka avec succès.',
    time: 'Il y a 2 h',
    type: 'info',
    read: true
  }
];
