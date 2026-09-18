import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Map as MapIcon,
  Navigation,
  Ship,
  Truck,
  AlertTriangle,
  Layers,
  Info,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
  Building2,
  Warehouse,
  Eye,
  RefreshCw,
  Search
} from 'lucide-react';
import { RegionType } from '../types';

interface RdcMapViewProps {
  currentRegion: RegionType;
  onChangeRegion: (region: RegionType) => void;
}

export interface HubGeoNode {
  id: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  casiers: number;
  capacity: number;
  type: 'Brasserie' | 'Hub Central' | 'Dépôt Relais' | 'Port';
  status: 'Optimal' | 'Vigilance' | 'Critique';
  trucksCount: number;
  bargesCount: number;
  notes: string;
  productsDominant: string;
}

export interface InTransitVehicle {
  id: string;
  name: string;
  type: 'barge' | 'truck';
  lat: number;
  lng: number;
  origin: string;
  destination: string;
  cargo: string;
  casiersCount: number;
  speedKmH: number;
  eta: string;
}

const DRC_REAL_HUBS: HubGeoNode[] = [
  {
    id: 'kin-hub',
    name: 'Direction Générale & Usine de Limete',
    city: 'Kinshasa',
    province: 'Kinshasa',
    lat: -4.3276,
    lng: 15.3136,
    casiers: 64200,
    capacity: 85000,
    type: 'Brasserie',
    status: 'Optimal',
    trucksCount: 42,
    bargesCount: 4,
    notes: 'Centre névralgique de production Primus, Turbo King et boissons gazeuses Vitalo.',
    productsDominant: 'Primus 50cl, Turbo King, Vitalo Ananas'
  },
  {
    id: 'mat-hub',
    name: 'Hub Portuaire Atlantique',
    city: 'Matadi',
    province: 'Kongo-Central',
    lat: -5.8167,
    lng: 13.4500,
    casiers: 19700,
    capacity: 30000,
    type: 'Port',
    status: 'Vigilance',
    trucksCount: 14,
    bargesCount: 1,
    notes: 'Réception des matières premières (malt importé, houblon) et desserte du Bas-Fleuve.',
    productsDominant: 'Castel Beer, Heineken, Primus'
  },
  {
    id: 'bma-hub',
    name: 'Dépôt Relais de Boma',
    city: 'Boma',
    province: 'Kongo-Central',
    lat: -5.8500,
    lng: 13.0500,
    casiers: 8400,
    capacity: 15000,
    type: 'Dépôt Relais',
    status: 'Optimal',
    trucksCount: 6,
    bargesCount: 1,
    notes: 'Plateforme de liaison maritime et routière vers Moanda et le littoral atlantique.',
    productsDominant: 'Primus 50cl, Castel Beer'
  },
  {
    id: 'kik-hub',
    name: 'Dépôt Régional Grand Bandundu',
    city: 'Kikwit',
    province: 'Kwilu',
    lat: -5.0411,
    lng: 18.8162,
    casiers: 11200,
    capacity: 22000,
    type: 'Dépôt Relais',
    status: 'Optimal',
    trucksCount: 9,
    bargesCount: 0,
    notes: 'Hub intermédiaire sur la RN1 desservant le Kwilu et l’accès au Grand Kasaï.',
    productsDominant: 'Turbo King, Primus 50cl'
  },
  {
    id: 'mbd-hub',
    name: 'Relais Fluvial de Mbandaka',
    city: 'Mbandaka',
    province: 'Équateur',
    lat: 0.0487,
    lng: 18.2603,
    casiers: 9400,
    capacity: 16000,
    type: 'Dépôt Relais',
    status: 'Optimal',
    trucksCount: 6,
    bargesCount: 4,
    notes: 'Escalier fluvial stratégique sur la boucle majestueuse du Fleuve Congo.',
    productsDominant: 'Primus 50cl, Vitalo Grenadine'
  },
  {
    id: 'kis-hub',
    name: 'Brasserie BRALIMA de Kisangani',
    city: 'Kisangani',
    province: 'Tshopo',
    lat: 0.5153,
    lng: 25.1910,
    casiers: 26800,
    capacity: 35000,
    type: 'Brasserie',
    status: 'Optimal',
    trucksCount: 18,
    bargesCount: 2,
    notes: 'Pôle industriel historique alimentant la Tshopo, l’Ituri et le Haut-Uélé.',
    productsDominant: 'Primus 50cl, Mutzig, Vitalo'
  },
  {
    id: 'gom-hub',
    name: 'Dépôt Régional du Nord-Kivu',
    city: 'Goma',
    province: 'Nord-Kivu',
    lat: -1.6585,
    lng: 29.2205,
    casiers: 14200,
    capacity: 25000,
    type: 'Hub Central',
    status: 'Vigilance',
    trucksCount: 12,
    bargesCount: 0,
    notes: 'Distribution dans les terrasses bordant le lac Kivu et la zone volcanique.',
    productsDominant: 'Mutzig, Primus, Heineken'
  },
  {
    id: 'bkv-hub',
    name: 'Antenne Lacustre de Bukavu',
    city: 'Bukavu',
    province: 'Sud-Kivu',
    lat: -2.5083,
    lng: 28.8608,
    casiers: 9500,
    capacity: 16000,
    type: 'Dépôt Relais',
    status: 'Optimal',
    trucksCount: 8,
    bargesCount: 2,
    notes: 'Liaison directe par canots rapides et vedettes-casiers sur le lac Kivu depuis Goma.',
    productsDominant: 'Mutzig, Primus 50cl'
  },
  {
    id: 'kan-hub',
    name: 'Dépôt Logistique du Kasaï',
    city: 'Kananga',
    province: 'Kasaï-Central',
    lat: -5.8958,
    lng: 22.4178,
    casiers: 6100,
    capacity: 20000,
    type: 'Dépôt Relais',
    status: 'Critique',
    trucksCount: 5,
    bargesCount: 0,
    notes: 'Alerte stock : retards de convois routiers RN1 suite aux pluies torrentielles.',
    productsDominant: 'Turbo King, Primus'
  },
  {
    id: 'mbj-hub',
    name: 'Dépôt Minier de Mbuji-Mayi',
    city: 'Mbuji-Mayi',
    province: 'Kasaï-Oriental',
    lat: -6.1360,
    lng: 23.5898,
    casiers: 7200,
    capacity: 18000,
    type: 'Dépôt Relais',
    status: 'Vigilance',
    trucksCount: 7,
    bargesCount: 0,
    notes: 'Forte demande ouvrière et urbaine sur Turbo King et Castel Beer.',
    productsDominant: 'Turbo King, Castel Beer'
  },
  {
    id: 'lsh-hub',
    name: 'Brasserie BRALIMA de Lubumbashi',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    lat: -11.6609,
    lng: 27.4794,
    casiers: 48500,
    capacity: 60000,
    type: 'Brasserie',
    status: 'Optimal',
    trucksCount: 36,
    bargesCount: 0,
    notes: 'Grand complexe brassicole du Copperbelt alimentant Likasi, Kolwezi et la frontière zambienne.',
    productsDominant: 'Castel Beer, Primus, Turbo King, Guinness'
  },
  {
    id: 'kol-hub',
    name: 'Dépôt Avancé de Kolwezi',
    city: 'Kolwezi',
    province: 'Lualaba',
    lat: -10.7167,
    lng: 25.4667,
    casiers: 13500,
    capacity: 22000,
    type: 'Dépôt Relais',
    status: 'Optimal',
    trucksCount: 11,
    bargesCount: 0,
    notes: 'Approvisionnement direct des camps miniers de cobalt/cuivre et terrasses de Manika.',
    productsDominant: 'Castel Beer 65cl, Turbo King'
  }
];

// Flotte en mouvement réel sur les axes congolais
const IN_TRANSIT_VEHICLES: InTransitVehicle[] = [
  {
    id: 'barge-01',
    name: 'Barge MB Lualaba Express',
    type: 'barge',
    lat: -1.25,
    lng: 17.20,
    origin: 'Kinshasa (Port BRALIMA)',
    destination: 'Mbandaka',
    cargo: '3 500 casiers Primus & Vitalo',
    casiersCount: 3500,
    speedKmH: 14,
    eta: 'Demain 11:30'
  },
  {
    id: 'barge-02',
    name: 'Barge Convoi Kisangani II',
    type: 'barge',
    lat: 1.45,
    lng: 23.10,
    origin: 'Kisangani Usine',
    destination: 'Bumba / Lisala',
    cargo: '2 800 casiers Mutzig & Primus',
    casiersCount: 2800,
    speedKmH: 18,
    eta: 'Ce soir 19:00'
  },
  {
    id: 'truck-01',
    name: 'Convoi RN1 Semi-remorque 30T N°04',
    type: 'truck',
    lat: -5.45,
    lng: 20.30,
    origin: 'Kinshasa Limete',
    destination: 'Kananga Dépôt',
    cargo: '800 casiers Turbo King & Castel',
    casiersCount: 800,
    speedKmH: 42,
    eta: 'T+14 heures'
  },
  {
    id: 'truck-02',
    name: 'Navette Minier Katanga N°12',
    type: 'truck',
    lat: -11.15,
    lng: 26.35,
    origin: 'Lubumbashi Usine',
    destination: 'Kolwezi',
    cargo: '850 casiers Castel 65cl',
    casiersCount: 850,
    speedKmH: 65,
    eta: 'Arrivée 16:45'
  }
];

// Real GPS Coords of Congo River Corridor
const CONGO_RIVER_COORDS: [number, number][] = [
  [-4.3276, 15.3136], // Kinshasa
  [-3.5000, 16.1000],
  [-2.8000, 16.4500],
  [-2.0500, 16.2500], // Bolobo
  [-1.0000, 17.1000], // Lukolela
  [0.0487, 18.2603],  // Mbandaka
  [0.8000, 19.1000],
  [1.4000, 20.2000],
  [2.1500, 22.4500],  // Bumba
  [1.5000, 23.6000],  // Basoko
  [0.5153, 25.1910]   // Kisangani
];

// Real GPS Coords of Route Nationale RN1
const RN1_HIGHWAY_COORDS: [number, number][] = [
  [-5.8167, 13.4500], // Matadi
  [-5.3000, 14.5000], // Mbanza-Ngungu
  [-4.3276, 15.3136], // Kinshasa
  [-4.8000, 17.5000],
  [-5.0411, 18.8162], // Kikwit
  [-5.5000, 20.4000], // Tshikapa
  [-5.8958, 22.4178], // Kananga
  [-6.1360, 23.5898], // Mbuji-Mayi
  [-7.5000, 24.3000],
  [-8.7300, 25.0000], // Kamina
  [-10.7167, 25.4667], // Kolwezi
  [-10.9833, 26.7333], // Likasi
  [-11.6609, 27.4794]  // Lubumbashi
];

export const RdcMapView: React.FC<RdcMapViewProps> = ({ currentRegion, onChangeRegion }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [selectedHub, setSelectedHub] = useState<HubGeoNode>(DRC_REAL_HUBS[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<InTransitVehicle | null>(null);

  // Basemap style layer
  const [tileLayerType, setTileLayerType] = useState<'carto' | 'osm' | 'satellite'>('carto');

  // Filter toggles
  const [showRiverRoutes, setShowRiverRoutes] = useState(true);
  const [showRoadRoutes, setShowRoadRoutes] = useState(true);
  const [showFleetTransit, setShowFleetTransit] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Tile layer reference
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Democratic Republic of the Congo
    const map = L.map(mapContainerRef.current, {
      center: [-3.8, 23.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false
    });

    // Custom Zoom controls at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routesLayerGroupRef.current = L.layerGroup().addTo(map);

    // Initial tile layer
    updateTileLayer(map, 'carto');

    // Force map resize check
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Change Tile Layer (Carto / OSM / Satellite ESRI)
  const updateTileLayer = (map: L.Map, type: 'carto' | 'osm' | 'satellite') => {
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap';

    if (type === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    } else if (type === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newLayer = L.tileLayer(url, {
      attribution,
      maxZoom: 18,
      subdomains: 'abcd'
    });

    newLayer.addTo(map);
    currentTileLayerRef.current = newLayer;
  };

  // Sync Tile Layer change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateTileLayer(mapInstanceRef.current, tileLayerType);
    }
  }, [tileLayerType]);

  // Render Routes (River & RN1)
  useEffect(() => {
    if (!routesLayerGroupRef.current) return;
    const group = routesLayerGroupRef.current;
    group.clearLayers();

    // Congo River Route
    if (showRiverRoutes) {
      const riverPoly = L.polyline(CONGO_RIVER_COORDS, {
        color: '#1d4ed8',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      });

      riverPoly.bindTooltip('🚢 Corridor Fluvial Fleuve Congo (Barges 3 500 casiers)', {
        sticky: true,
        className: 'bg-[#071b45] text-white font-bold text-xs rounded shadow-lg'
      });

      group.addLayer(riverPoly);
    }

    // RN1 National Highway
    if (showRoadRoutes) {
      const roadPoly = L.polyline(RN1_HIGHWAY_COORDS, {
        color: '#d97706',
        weight: 4,
        opacity: 0.85,
        dashArray: '6, 4',
        lineCap: 'round'
      });

      roadPoly.bindTooltip('🚚 Route Nationale RN1 (Axe Minier Katanga & Kasaï)', {
        sticky: true,
        className: 'bg-amber-900 text-white font-bold text-xs rounded shadow-lg'
      });

      group.addLayer(roadPoly);
    }
  }, [showRiverRoutes, showRoadRoutes]);

  // Render Markers (Hubs & Fleet in transit)
  useEffect(() => {
    if (!markersLayerGroupRef.current || !mapInstanceRef.current) return;
    const group = markersLayerGroupRef.current;
    group.clearLayers();

    // Filter hubs based on search
    const filteredHubs = DRC_REAL_HUBS.filter(
      (h) =>
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.province.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 1. Hub Markers
    filteredHubs.forEach((hub) => {
      const isSelected = selectedHub.id === hub.id;

      const bgColor =
        hub.status === 'Critique'
          ? '#e5484d'
          : hub.type === 'Brasserie'
          ? '#18a66a'
          : '#1769ff';

      const iconEmoji =
        hub.type === 'Brasserie' ? '🏭' : hub.type === 'Port' ? '⚓' : '📦';

      const customHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          <div style="
            background-color: ${bgColor};
            width: ${isSelected ? '34px' : '28px'};
            height: ${isSelected ? '34px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid ${isSelected ? '#071b45' : 'white'};
            transition: all 0.2s ease;
          ">
            ${iconEmoji}
          </div>
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 3px;
            background-color: ${isSelected ? '#071b45' : 'rgba(255,255,255,0.95)'};
            color: ${isSelected ? '#f4bd18' : '#172033'};
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.1);
          ">
            ${hub.city}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-hub-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedHub(hub);
        setSelectedVehicle(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([hub.lat, hub.lng]);
        }
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; min-width: 180px;">
          <strong style="color: #071b45; font-size: 14px;">${hub.name}</strong><br/>
          <span style="color: #64748b;">${hub.type} · ${hub.province}</span><br/>
          <hr style="margin: 6px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <strong>Stock :</strong> ${hub.casiers.toLocaleString('fr-FR')} casiers<br/>
          <strong>Statut :</strong> <span style="font-weight: bold; color: ${bgColor};">${hub.status}</span><br/>
          <strong>Flotte :</strong> ${hub.trucksCount} camions / ${hub.bargesCount} barges
        </div>
      `);

      group.addLayer(marker);
    });

    // 2. In-Transit Vehicles
    if (showFleetTransit) {
      IN_TRANSIT_VEHICLES.forEach((veh) => {
        const isBarge = veh.type === 'barge';
        const isSelected = selectedVehicle?.id === veh.id;

        const customHtml = `
          <div class="relative cursor-pointer" style="transform: translate(-50%, -50%);">
            <div style="
              background-color: ${isBarge ? '#0284c7' : '#d97706'};
              width: 26px;
              height: 26px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 2px solid white;
              animation: pulse 2s infinite;
            ">
              ${isBarge ? '🚢' : '🚛'}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'transit-vehicle-marker',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([veh.lat, veh.lng], { icon });

        marker.on('click', () => {
          setSelectedVehicle(veh);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; min-width: 190px;">
            <strong style="color: #071b45; font-size: 13px;">${veh.name}</strong><br/>
            <span>Trajet : ${veh.origin} ➔ ${veh.destination}</span><br/>
            <hr style="margin: 5px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <strong>Chargement :</strong> ${veh.cargo}<br/>
            <strong>Vitesse :</strong> ${veh.speedKmH} km/h · <strong>ETA :</strong> ${veh.eta}
          </div>
        `);

        group.addLayer(marker);
      });
    }
  }, [DRC_REAL_HUBS, selectedHub, selectedVehicle, showFleetTransit, searchQuery]);

  // Quick Zoom Helper
  const handleFlyTo = (lat: number, lng: number, zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-[18px]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#071b45] text-[#f4bd18] uppercase tracking-wider">
              Cartographie Réelle SIG RDC
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Géolocalisation OpenStreetMap & Satellite ESRI
            </span>
          </div>
          <h1 className="text-[25px] font-extrabold text-[#172033] tracking-tight">
            Carte Réelle de la République Démocratique du Congo
          </h1>
          <p className="text-[#718096] text-[13px] mt-[3px]">
            Supervision géolocalisée temps réel des brasseries, dépôts provinciaux, convois routiers RN1 et barges fluviales sur le Fleuve Congo.
          </p>
        </div>

        {/* Quick Region Viewport Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#e4eaf2] p-1.5 rounded-xl shadow-xs text-[11px] font-bold">
          <button
            onClick={() => handleFlyTo(-3.8, 23.5, 5)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[#071b45] transition-colors"
          >
            🇨🇩 Toute la RDC
          </button>
          <button
            onClick={() => handleFlyTo(-4.3276, 15.3136, 9)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[#071b45] transition-colors"
          >
            Kinshasa & Bas-Congo
          </button>
          <button
            onClick={() => handleFlyTo(-11.6609, 27.4794, 8)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[#071b45] transition-colors"
          >
            Katanga (Lubumbashi)
          </button>
          <button
            onClick={() => handleFlyTo(-1.6585, 29.2205, 8)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[#071b45] transition-colors"
          >
            Grands Lacs (Goma)
          </button>
          <button
            onClick={() => handleFlyTo(0.5153, 25.1910, 8)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[#071b45] transition-colors"
          >
            Kisangani (Tshopo)
          </button>
        </div>
      </div>

      {/* Main Grid: Real Leaflet Map + Comprehensive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.4fr_1fr] gap-[16px]">
        {/* Real Map Box */}
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[580px]">
          {/* Top Map Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 text-[12px]">
            {/* Basemap Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setTileLayerType('carto')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tileLayerType === 'carto' ? 'bg-white text-[#071b45] shadow-xs' : 'text-slate-600'
                }`}
              >
                🗺️ Carte Claire
              </button>
              <button
                onClick={() => setTileLayerType('satellite')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tileLayerType === 'satellite' ? 'bg-[#071b45] text-[#f4bd18] shadow-xs' : 'text-slate-600'
                }`}
              >
                🌍 Satellite Réel
              </button>
              <button
                onClick={() => setTileLayerType('osm')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tileLayerType === 'osm' ? 'bg-white text-[#071b45] shadow-xs' : 'text-slate-600'
                }`}
              >
                🧭 OpenStreetMap
              </button>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRiverRoutes(!showRiverRoutes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                  showRiverRoutes ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Ship className="w-3.5 h-3.5" />
                Fleuve Congo
              </button>

              <button
                onClick={() => setShowRoadRoutes(!showRoadRoutes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                  showRoadRoutes ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Axe RN1
              </button>

              <button
                onClick={() => setShowFleetTransit(!showFleetTransit)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                  showFleetTransit ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <RadioIcon className="w-3.5 h-3.5" />
                Flotte Active
              </button>
            </div>
          </div>

          {/* REAL LEAFLET MAP CONTAINER */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden min-h-[480px] border border-slate-200 z-10 shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

            {/* Overlay Map Legend badge */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1">
              <div className="font-extrabold text-[#071b45] flex items-center gap-1 mb-1">
                <Compass className="w-3.5 h-3.5 text-[#1769ff]" />
                Légende du Réseau RDC :
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#18a66a]" />
                <span>Usines / Brasseries Locales</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1769ff]" />
                <span>Dépôts Relais & Ports</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5484d]" />
                <span>Tension Stock / Alerte Route</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-blue-600 border-dashed" />
                <span>Navettes Fluviales (Fleuve Congo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-amber-600" />
                <span>Route Nationale RN1 (Matadi-Katanga)</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar Info */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#718096] gap-2">
            <span>
              Couverture territoriale réelle : <strong>26 provinces couvertes · 12 dépôts stratégiques</strong>
            </span>
            <span>
              Flotte géolocalisée : <strong>149 camions 30T & 10 barges fluviales</strong>
            </span>
          </div>
        </div>

        {/* Selected Hub / Vehicle Inspector Sidebar */}
        <div className="bg-white border border-[#e4eaf2] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {selectedVehicle ? (
              /* Vehicle in Transit details */
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                      Flotte en Mouvement
                    </span>
                    <h3 className="text-[17px] font-extrabold text-[#172033] mt-0.5">
                      {selectedVehicle.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                    En Transit
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Origine :</span>
                    <strong className="text-slate-800">{selectedVehicle.origin}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination :</span>
                    <strong className="text-slate-800">{selectedVehicle.destination}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vitesse réelle :</span>
                    <strong className="text-slate-800">{selectedVehicle.speedKmH} km/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Heure estimée (ETA) :</span>
                    <strong className="text-emerald-700">{selectedVehicle.eta}</strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-[12px]">
                  <span className="text-blue-900 font-bold block mb-1">Cargaison déclarée :</span>
                  <span className="text-blue-800 font-semibold">{selectedVehicle.cargo}</span>
                </div>

                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] rounded-xl transition-all"
                >
                  Retour à l'inspection des Hubs
                </button>
              </div>
            ) : (
              /* Hub Inspector details */
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-[#1769ff] uppercase tracking-wider">
                      {selectedHub.type} · {selectedHub.province}
                    </span>
                    <h3 className="text-[18px] font-extrabold text-[#172033] mt-0.5 leading-tight">
                      {selectedHub.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedHub.status === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedHub.status === 'Vigilance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}
                  >
                    {selectedHub.status}
                  </span>
                </div>

                {/* Stock Level Gauge */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-[#718096]">Stock disponible :</span>
                    <strong className="text-[#172033]">
                      {selectedHub.casiers.toLocaleString('fr-FR')} /{' '}
                      {selectedHub.capacity.toLocaleString('fr-FR')} casiers
                    </strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedHub.casiers / selectedHub.capacity < 0.35
                          ? 'bg-red-500'
                          : 'bg-[#18a66a]'
                      }`}
                      style={{
                        width: `${Math.round((selectedHub.casiers / selectedHub.capacity) * 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0</span>
                    <span>
                      {Math.round((selectedHub.casiers / selectedHub.capacity) * 100)}% de remplissage
                    </span>
                    <span>{selectedHub.capacity.toLocaleString('fr-FR')}</span>
                  </div>
                </div>

                {/* Logistics Assets */}
                <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-[12px]">
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-1.5 text-[#1769ff] font-semibold text-[11px]">
                      <Truck className="w-3.5 h-3.5" /> Camions assignés
                    </div>
                    <div className="text-[17px] font-extrabold text-[#071b45] mt-0.5">
                      {selectedHub.trucksCount}
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-1.5 text-[#1769ff] font-semibold text-[11px]">
                      <Ship className="w-3.5 h-3.5" /> Barges en rotation
                    </div>
                    <div className="text-[17px] font-extrabold text-[#071b45] mt-0.5">
                      {selectedHub.bargesCount}
                    </div>
                  </div>
                </div>

                {/* Products Dominant */}
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px]">
                  <div className="font-bold text-slate-700 mb-0.5 text-[11px]">Marques prioritaires :</div>
                  <div className="text-slate-600 text-[11px] font-medium">
                    {selectedHub.productsDominant}
                  </div>
                </div>

                {/* Notes & Observations */}
                <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-[12px] text-amber-950">
                  <div className="font-bold flex items-center gap-1 mb-1 text-[11px]">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Observations opérationnelles :
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    {selectedHub.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onChangeRegion(selectedHub.city as RegionType);
                handleFlyTo(selectedHub.lat, selectedHub.lng, 9);
              }}
              className="w-full py-2.5 bg-[#071b45] hover:bg-[#0c2c6d] text-white font-bold text-[12px] rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Centrer et filtrer sur {selectedHub.city}</span>
              <ChevronRight className="w-4 h-4 text-[#f4bd18]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function RadioIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </svg>
  );
}
