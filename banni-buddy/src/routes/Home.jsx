import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import LocalitySelector from '../features/locality/components/LocalitySelector.jsx';
import { useLocalityStore } from '../store/useLocalityStore.js';
import { useLocalityStats } from '../features/locality/hooks/useLocalityStats.js';
import { useRecentRequests } from '../features/help-requests/hooks/useRecentRequests.js';
import { getDefaultCoordinates } from '../features/locality/data/coordinates.js';
import { 
  Users, AlertCircle, Radio, GitCommit, Bug, 
  Map as MapIcon, EyeOff, Thermometer, Wind, 
  Shield, ShoppingBag, Film, Bus, PlusCircle, Newspaper, MessageSquare,
  Navigation, Phone, Info, ExternalLink
} from 'lucide-react';
import styles from './Home.module.css';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const placeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 14);
    }
  }, [center, map]);
  return null;
};

const LOCALITY_DATA = {
  "BTM Layout": {
    weather: { temp: "29°C", condition: "Haze", aqi: "52", quality: "Moderate" },
    news: "Traffic diversions announced near Silk Board junction for upcoming metro girder installations over the weekend.",
    places: {
      Police: [{ name: "BTM Layout Police Station", lat: 12.9152, lng: 77.6062, phone: "080-22942565", bus: "BTM Water Tank Stop" }],
      Hospitals: [{ name: "Gangothri Hospital", lat: 12.9161, lng: 77.6105, phone: "080-26683333", bus: "BTM 16th Main Stop" }],
      "Bus Stops": [{ name: "BTM Layout Water Tank Bus Station", lat: 12.9145, lng: 77.6048, phone: "BMTC Info: 149", bus: "On-site Hub" }],
      Malls: [{ name: "Vega City Mall", lat: 12.9084, lng: 77.6012, phone: "080-67650000", bus: "Bannerghatta Road Stop" }],
      Theatres: [{ name: "Gopalan Innovation Mall", lat: 12.9138, lng: 77.5969, phone: "080-26584444", bus: "Jayadeva Hospital Stop" }]
    }
  },
  "HSR Layout": {
    weather: { temp: "28°C", condition: "Sunny", aqi: "42", quality: "Good" },
    news: "Sector 3 Residents Welfare Association schedules a comprehensive organic composting drive this Sunday morning.",
    places: {
      Police: [{ name: "HSR Layout Police Station", lat: 12.9116, lng: 77.6385, phone: "080-22943466", bus: "HSR Club Stop" }],
      Hospitals: [{ name: "Narayana Multispeciality Hospital", lat: 12.9098, lng: 77.6452, phone: "080-67506750", bus: "HSR 14th Main Stop" }],
      "Bus Stops": [{ name: "HSR BDA Complex Bus Station", lat: 12.9122, lng: 77.6378, phone: "BMTC Info: 149", bus: "On-site Hub" }],
      Malls: [{ name: "Market Square Mall", lat: 12.9234, lng: 77.6429, phone: "080-49158000", bus: "Sarjapur Road Stop" }],
      Theatres: [{ name: "PVR Soul Spirit Mall", lat: 12.9241, lng: 77.6715, phone: "080-41522222", bus: "Bellandur Gate Stop" }]
    }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { localityName } = useLocalityStore();
  const { data: stats } = useLocalityStats();
  const { data: recentRequests } = useRecentRequests();
  
  const [showMap, setShowMap] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const coords = getDefaultCoordinates(localityName);
  const currentLocalData = LOCALITY_DATA[localityName] || {
    weather: { temp: "28°C", condition: "Clear", aqi: "45", quality: "Good" },
    news: "Local ward community updates are continuously compiled by nearby community volunteers.",
    places: { Police: [], Hospitals: [], "Bus Stops": [], Malls: [], Theatres: [] }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const getMapsLink = (destLat, destLng) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
  };

  const quickLinks = [
    { name: 'Police', icon: Shield, color: '#1E4D2B' },
    { name: 'Hospitals', icon: PlusCircle, color: '#D9381E' },
    { name: 'Bus Stops', icon: Bus, color: '#2B6CB0' },
    { name: 'Malls', icon: ShoppingBag, color: '#D69E2E' },
    { name: 'Theatres', icon: Film, color: '#805AD5' },
  ];

  const utilityContacts = [
    { name: "BESCOM Electricity Helpline", phone: "1912" },
    { name: "BWSSB Water Supply Helpline", phone: "1916" },
    { name: "BMTC Transport Control", phone: "18004251663" },
    { name: "Namma Metro Customer Care", phone: "08025191091" }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.statusBar}>
        <div className={styles.statusItem}>
          <Radio size={14} className={styles.liveIcon} />
          <span>System Live</span>
        </div>
        <div className={styles.statusGroup}>
          <div className={styles.statusItem}>
            <GitCommit size={14} />
            <span>v1.0 (42)</span>
          </div>
          <div className={styles.statusItem}>
            <Bug size={14} />
            <span>3</span>
          </div>
        </div>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Namaskara</h1>
        <p className={styles.subtitle}>
          {localityName ? `Dashboard for ${localityName}` : 'Select your locality to see updates'}
        </p>
      </header>

      <LocalitySelector />

      {localityName && (
        <div className={styles.dashboard}>
          <div className={styles.envGrid}>
            <div className={styles.envCard}>
              <Thermometer size={20} color="var(--color-primary)" />
              <div className={styles.envData}>
                <span className={styles.envValue}>{currentLocalData.weather.temp}</span>
                <span className={styles.envLabel}>{currentLocalData.weather.condition}</span>
              </div>
            </div>
            <div className={styles.envCard}>
              <Wind size={20} color="#2B6CB0" />
              <div className={styles.envData}>
                <span className={styles.envValue}>{currentLocalData.weather.aqi} AQI</span>
                <span className={styles.envLabel}>{currentLocalData.weather.quality}</span>
              </div>
            </div>
          </div>

          {stats && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: '#FDF1F0', color: 'var(--color-danger)' }}>
                  <AlertCircle size={24} />
                </div>
                <div className={styles.statText}>
                  <span className={styles.statValue}>{stats.activeRequests}</span>
                  <span className={styles.statLabel}>People need help</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <Users size={24} />
                </div>
                <div className={styles.statText}>
                  <span className={styles.statValue}>{stats.activeHelpers}</span>
                  <span className={styles.statLabel}>Buddies nearby</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Search Nearby</h2>
            <div className={styles.quickNavGrid}>
              {quickLinks.map((link) => (
                <button 
                  key={link.name} 
                  className={`${styles.quickNavItem} ${selectedCategory === link.name ? styles.quickNavActive : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === link.name ? null : link.name)}
                >
                  <link.icon size={24} color={link.color} />
                  <span>{link.name}</span>
                </button>
              ))}
            </div>

            {selectedCategory && (
              <div className={styles.placesList}>
                {currentLocalData.places[selectedCategory]?.map((place, idx) => (
                  <div key={idx} className={styles.placeCard}>
                    <div className={styles.placeCardInfo}>
                      <h4>{place.name}</h4>
                      <p className={styles.placeDetailItem}>
                        <Bus size={14} /> Nearest Bus Stop: {place.bus}
                      </p>
                      {userLocation && (
                        <p className={styles.placeDetailItem}>
                          <Navigation size={14} /> {calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)} km away from you
                        </p>
                      )}
                    </div>
                    <div className={styles.placeCardActions}>
                      <a href={`tel:${place.phone}`} className={styles.placeActionBtn} title="Call Destination">
                        <Phone size={16} />
                      </a>
                      <a href={getMapsLink(place.lat, place.lng)} target="_blank" rel="noopener noreferrer" className={`${styles.placeActionBtn} ${styles.navigateBtn}`} title="Navigate on Google Maps">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Neighborhood Map</h2>
              <button className={styles.toggleButton} onClick={() => setShowMap(!showMap)}>
                {showMap ? <><EyeOff size={16} /> Hide</> : <><MapIcon size={16} /> Show</>}
              </button>
            </div>
            
            {showMap && (
              <div className={styles.mapContainer}>
                <MapContainer center={[coords.lat, coords.lng]} zoom={14} className={styles.leafletMap}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ChangeMapCenter center={coords} />
                  
                  {recentRequests?.map((req, index) => {
                    const latOffset = (index - 1) * 0.003;
                    const lngOffset = ((index % 2) - 0.5) * 0.004;
                    return (
                      <Marker 
                        key={req.id} 
                        position={[coords.lat + latOffset, coords.lng + lngOffset]} 
                        icon={customIcon}
                      >
                        <Popup>
                          <div className={styles.popupContent}>
                            <span className={styles.popupCategory}>{req.category}</span>
                            <h4 className={styles.popupTitle}>{req.title}</h4>
                            <button className={styles.popupButton} onClick={() => navigate('/requests')}>
                              <MessageSquare size={14} /> View Feed
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {selectedCategory && currentLocalData.places[selectedCategory]?.map((place, idx) => (
                    <Marker key={`place-${idx}`} position={[place.lat, place.lng]} icon={placeIcon}>
                      <Popup>
                        <div className={styles.popupContent}>
                          <span className={styles.popupCategory}>{selectedCategory}</span>
                          <h4 className={styles.popupTitle}>{place.name}</h4>
                          <p style={{ margin: '4px 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>Bus: {place.bus}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Updates (Past 24 Hours)</h2>
            <div className={styles.newsCard}>
              <Newspaper size={20} color="var(--color-primary)" />
              <div className={styles.newsContent}>
                <h4>Locality Circular</h4>
                <p>{currentLocalData.news}</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Emergency & Utility Helplines</h2>
            <div className={styles.utilityGrid}>
              {utilityContacts.map((contact, idx) => (
                <div key={idx} className={styles.utilityCard}>
                  <div className={styles.utilityInfo}>
                    <Info size={16} color="var(--color-primary)" />
                    <span>{contact.name}</span>
                  </div>
                  <a href={`tel:${contact.phone}`} className={styles.utilityPhone}>
                    <Phone size={14} /> {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actionGrid}>
            <button className={styles.disabledAction} disabled>
              Join as a Buddy (Coming Soon)
            </button>
            <button className={styles.disabledAction} disabled>
              Contribute (Coming Soon)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;