import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CATEGORIES = [
  { id: "all", label: "Все", icon: "🗺️" },
  { id: "museum", label: "Музеи", icon: "🏛️" },
  { id: "restaurant", label: "Рестораны", icon: "🍽️" },
  { id: "park", label: "Парки", icon: "🌿" },
  { id: "landmark", label: "Достопримечательности", icon: "⭐" },
  { id: "hotel", label: "Отели", icon: "🏨" },
];

interface Place {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  desc: string;
  address: string;
  rating: number;
}

const PLACES: Place[] = [
  {
    id: 1,
    name: "Эрмитаж",
    category: "museum",
    lat: 59.9397,
    lng: 30.3142,
    desc: "Один из крупнейших художественных музеев мира. Основан в 1764 году Екатериной II.",
    address: "Дворцовая пл., 2",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Русский музей",
    category: "museum",
    lat: 59.9387,
    lng: 30.3324,
    desc: "Крупнейший в мире музей русского изобразительного искусства.",
    address: "ул. Инженерная, 4",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Кунсткамера",
    category: "museum",
    lat: 59.9415,
    lng: 30.3043,
    desc: "Первый российский публичный музей, основанный Петром I.",
    address: "Университетская наб., 3",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Петропавловская крепость",
    category: "landmark",
    lat: 59.9499,
    lng: 30.3166,
    desc: "Историческое ядро города, заложенное Петром I в 1703 году.",
    address: "Петропавловская крепость, 3",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Исаакиевский собор",
    category: "landmark",
    lat: 59.9342,
    lng: 30.3062,
    desc: "Крупнейший православный храм Санкт-Петербурга, выдающийся образец позднего классицизма.",
    address: "Исаакиевская пл., 4",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Медный всадник",
    category: "landmark",
    lat: 59.9363,
    lng: 30.3025,
    desc: "Знаменитая конная статуя Петра I на Сенатской площади.",
    address: "Сенатская пл.",
    rating: 4.7,
  },
  {
    id: 7,
    name: "Казанский собор",
    category: "landmark",
    lat: 59.9343,
    lng: 30.3242,
    desc: "Один из крупнейших храмов Санкт-Петербурга, памятник Отечественной войны 1812 года.",
    address: "Казанская пл., 2",
    rating: 4.6,
  },
  {
    id: 8,
    name: "Летний сад",
    category: "park",
    lat: 59.9451,
    lng: 30.3336,
    desc: "Старейший парк Санкт-Петербурга, заложенный при Петре I в 1704 году.",
    address: "Наб. Кутузова, 2",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Михайловский сад",
    category: "park",
    lat: 59.9405,
    lng: 30.3302,
    desc: "Исторический сад при Михайловском дворце с красивыми видами на Спас-на-Крови.",
    address: "ул. Садовая, 2",
    rating: 4.5,
  },
  {
    id: 10,
    name: "Ресторан «Terrassa»",
    category: "restaurant",
    lat: 59.934,
    lng: 30.3229,
    desc: "Ресторан с панорамной террасой и видом на Казанский собор и Невский проспект.",
    address: "ул. Казанская, 3",
    rating: 4.4,
  },
  {
    id: 11,
    name: "Cococo",
    category: "restaurant",
    lat: 59.9278,
    lng: 30.2988,
    desc: "Ресторан авторской кухни от Игоря Гришечкина. Современная русская кухня.",
    address: "Вознесенский пр., 6",
    rating: 4.7,
  },
  {
    id: 12,
    name: "Four Seasons Lion Palace",
    category: "hotel",
    lat: 59.935,
    lng: 30.303,
    desc: "Роскошный отель в историческом дворце Лобанова-Ростовского, вид на Исаакиевский собор.",
    address: "Вознесенский пр., 1",
    rating: 4.9,
  },
  {
    id: 13,
    name: "Astoria Hotel",
    category: "hotel",
    lat: 59.9348,
    lng: 30.3068,
    desc: "Легендарный отель 1912 года в самом сердце Санкт-Петербурга, на Исаакиевской площади.",
    address: "Большая Морская ул., 39",
    rating: 4.8,
  },
  {
    id: 14,
    name: "Спас-на-Крови",
    category: "landmark",
    lat: 59.9401,
    lng: 30.3287,
    desc: "Храм Воскресения Христова, построенный на месте убийства императора Александра II.",
    address: "Набережная канала Грибоедова, 2Б",
    rating: 4.8,
  },
  {
    id: 15,
    name: "Смольный собор",
    category: "landmark",
    lat: 59.9485,
    lng: 30.3948,
    desc: "Шедевр архитектуры барокко работы Бартоломео Растрелли.",
    address: "пл. Растрелли, 1",
    rating: 4.6,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  museum: "#a78bfa",
  restaurant: "#f97316",
  park: "#22c55e",
  landmark: "#f0e020",
  hotel: "#38bdf8",
};

function createColoredIcon(category: string) {
  const color = CATEGORY_COLORS[category] || "#ffffff";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 32px; height: 32px;
      background: ${color};
      border: 3px solid rgba(0,0,0,0.5);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const filtered = PLACES.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [59.939, 30.316],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    filtered.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createColoredIcon(place.category),
      });

      const cat = CATEGORIES.find((c) => c.id === place.category);
      marker.bindPopup(`
        <div style="background:#1a1a1a;color:#fff;padding:12px;min-width:200px;font-family:sans-serif;">
          <div style="font-weight:bold;font-size:14px;margin-bottom:4px;">${place.name}</div>
          <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px;">${cat?.icon ?? ""} ${place.address}</div>
          <div style="color:rgba(255,255,255,0.7);font-size:12px;line-height:1.5;">${place.desc}</div>
          <div style="color:#f0e020;font-size:12px;font-weight:bold;margin-top:8px;">★ ${place.rating}</div>
        </div>
      `, {
        className: "custom-dark-popup",
      });

      marker.on("click", () => {
        setSelectedPlace(place);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [filtered.map((p) => p.id).join(",")]);

  function handlePlaceClick(place: Place) {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.flyTo([place.lat, place.lng], 16, { duration: 1.2 });
    }
  }

  function handleZoomIn() {
    mapRef.current?.zoomIn();
  }

  function handleZoomOut() {
    mapRef.current?.zoomOut();
  }

  const catInfo = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="font-golos bg-[#0a0a0a] text-white h-screen flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur z-50 flex-shrink-0">
        <a href="/" className="font-oswald font-bold text-xl tracking-wider mr-2">
          ПОЕХАЛИ<span className="text-[#f0e020]">.</span>DEV
        </a>
        <div className="w-px h-6 bg-white/20" />
        <span className="text-white/40 text-sm font-medium tracking-wide">КАРТА САНКТ-ПЕТЕРБУРГА</span>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск мест..."
            className="bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-4 py-2 pr-8 w-64 focus:outline-none focus:border-[#f0e020]/50 transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">⌕</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/50 hover:text-white text-sm px-3 py-2 border border-white/10 hover:border-white/30 transition-colors hidden md:flex items-center gap-2"
        >
          {sidebarOpen ? "← Скрыть" : "→ Список"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`
            flex-shrink-0 bg-[#111] border-r border-white/10 flex flex-col overflow-hidden
            transition-all duration-300
            ${sidebarOpen ? "w-80" : "w-0"}
          `}
        >
          <div className="flex flex-col h-full min-w-80">
            {/* Categories */}
            <div className="p-3 border-b border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#f0e020] text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile search */}
            <div className="p-3 border-b border-white/10 md:hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск мест..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-3 py-2 focus:outline-none focus:border-[#f0e020]/50"
              />
            </div>

            {/* Count */}
            <div className="px-4 py-2 text-white/30 text-xs border-b border-white/5">
              {filtered.length} {filtered.length === 1 ? "место" : filtered.length < 5 ? "места" : "мест"}
              {catInfo && activeCategory !== "all" ? ` · ${catInfo.icon} ${catInfo.label}` : ""}
            </div>

            {/* Places list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-sm">
                  Ничего не найдено
                </div>
              ) : (
                filtered.map((place) => {
                  const cat = CATEGORIES.find((c) => c.id === place.category);
                  const isSelected = selectedPlace?.id === place.id;
                  return (
                    <div
                      key={place.id}
                      onClick={() => handlePlaceClick(place)}
                      className={`px-4 py-3 cursor-pointer border-b border-white/5 transition-all ${
                        isSelected
                          ? "bg-[#f0e020]/10 border-l-2 border-l-[#f0e020]"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{cat?.icon}</span>
                            <span className={`font-medium text-sm truncate ${isSelected ? "text-[#f0e020]" : "text-white"}`}>
                              {place.name}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{place.desc}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-white/30 text-xs">📍 {place.address}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-1 text-[#f0e020] text-xs font-medium">
                          <span>★</span>
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* MAP */}
        <main className="flex-1 relative overflow-hidden">
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

          {/* Zoom controls */}
          <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 bg-[#1a1a1a] border border-white/20 text-white text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 bg-[#1a1a1a] border border-white/20 text-white text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              −
            </button>
          </div>

          {/* Selected place card */}
          {selectedPlace && (
            <div className="absolute bottom-6 left-4 z-[1000] max-w-xs w-full bg-[#111] border border-white/20 p-4 shadow-2xl">
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 text-white/30 hover:text-white text-lg leading-none"
              >
                ×
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span>{CATEGORIES.find((c) => c.id === selectedPlace.category)?.icon}</span>
                <span className="font-oswald font-bold text-base text-[#f0e020]">{selectedPlace.name}</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-3">{selectedPlace.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">📍 {selectedPlace.address}</span>
                <span className="text-[#f0e020] text-xs font-bold">★ {selectedPlace.rating}</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 z-[1000] bg-[#111]/90 border border-white/10 p-3 backdrop-blur">
            <div className="text-white/30 text-xs mb-2 font-medium tracking-wider">ЛЕГЕНДА</div>
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.id] || "#fff" }}
                />
                <span className="text-white/50 text-xs">{cat.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        .custom-dark-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          padding: 0;
        }
        .custom-dark-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-dark-popup .leaflet-popup-tip {
          background: #1a1a1a;
        }
        .custom-dark-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,0.4);
          font-size: 18px;
          top: 8px;
          right: 8px;
        }
        .custom-dark-popup .leaflet-popup-close-button:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}
