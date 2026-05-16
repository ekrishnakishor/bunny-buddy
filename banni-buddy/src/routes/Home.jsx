import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import LocalitySelector from '../features/locality/components/LocalitySelector.jsx';
import { useLocalityStore } from '../store/useLocalityStore.js';
import { useLocalityStats } from '../features/locality/hooks/useLocalityStats.js';
import { useRecentRequests } from '../features/help-requests/hooks/useRecentRequests.js';
import { useNearbyPlaces } from '../features/locality/hooks/useNearbyPlaces.js';
import { useLocalityNews } from '../features/locality/hooks/useLocalityNews.js';
import { useLocalityWeather } from '../features/locality/hooks/useLocalityWeather.js';
import { getDefaultCoordinates } from '../features/locality/data/coordinates.js';
import { 
  Users, AlertCircle, Radio, GitCommit, Bug, 
  Map as MapIcon, EyeOff, Thermometer, Wind, 
  Shield, ShoppingBag, Film, Bus, PlusCircle, Newspaper, MessageSquare,
  Navigation, Phone, Info, ExternalLink, HeartHandshake 
} from 'lucide-react';
import styles from './Home.module.css';
import 'leaflet/dist/leaflet.css';

const requestIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const placeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 15);
    }
  }, [center, map]);
  return null;
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
  
  const { places: dynamicPlaces, loading: loadingPlaces } = useNearbyPlaces(coords.lat, coords.lng, selectedCategory);
  const { newsList, loading: loadingNews } = useLocalityNews(localityName);
  const { weather: localWeather, loading: loadingWeather } = useLocalityWeather(coords.lat, coords.lng);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.warn("User location access restricted or unavailable"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
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

  const bounds = L.latLngBounds(
    [coords.lat - 0.04, coords.lng - 0.04],
    [coords.lat + 0.04, coords.lng + 0.04]
  );

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
        <div className={styles.welcomeBadge}>
          <HeartHandshake size={16} />
          <span>Welcome to Banni Buddy</span>
        </div>
        <h1 className={styles.title}>
          Namaskara <span className={styles.wave}>👋</span>
        </h1>
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
                <span className={styles.envValue}>
                  {loadingWeather ? "..." : localWeather?.temp || "28°C"}
                </span>
                <span className={styles.envLabel}>
                  {loadingWeather ? "Loading" : localWeather?.condition || "Clear"}
                </span>
              </div>
            </div>
            <div className={styles.envCard}>
              <Wind size={20} color="#2B6CB0" />
              <div className={styles.envData}>
                <span className={styles.envValue}>
                  {loadingWeather ? "..." : `${localWeather?.aqi || "45"} AQI`}
                </span>
                <span className={styles.envLabel}>
                  {loadingWeather ? "Loading" : localWeather?.quality || "Good"}
                </span>
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
                {loadingPlaces && <p style={{textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)'}}>Scanning satellite data for nearby {selectedCategory}...</p>}
                
                {!loadingPlaces && dynamicPlaces.length === 0 && (
                  <p style={{textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)'}}>No {selectedCategory} found within 3km of this center.</p>
                )}

                {!loadingPlaces && dynamicPlaces.map((place, idx) => (
                  <div key={idx} className={styles.placeCard}>
                    <div className={styles.placeCardInfo}>
                      <h4>{place.name}</h4>
                      <p className={styles.placeDetailItem}>
                        <Bus size={14} /> Bus Connection: {place.bus}
                      </p>
                      {userLocation && (
                        <p className={styles.placeDetailItem}>
                          <Navigation size={14} /> {calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)} km away from you
                        </p>
                      )}
                    </div>
                    <div className={styles.placeCardActions}>
                      {place.phone !== 'Not listed' && (
                        <a href={`tel:${place.phone}`} className={styles.placeActionBtn} title="Call Destination">
                          <Phone size={16} />
                        </a>
                      )}
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
              <h2 className={styles.sectionTitle}>Neighborhood Satellite Map</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {userLocation && (
                  <button 
                    className={styles.toggleButton} 
                    onClick={() => {
                      const el = document.querySelector('.leaflet-container');
                      if (el && el._leaflet_map) {
                        el._leaflet_map.setView([userLocation.lat, userLocation.lng], 16);
                      }
                    }}
                  >
                    <Navigation size={14} /> Me
                  </button>
                )}
                <button className={styles.toggleButton} onClick={() => setShowMap(!showMap)}>
                  {showMap ? <><EyeOff size={16} /> Hide</> : <><MapIcon size={16} /> Show</>}
                </button>
              </div>
            </div>
            
            {showMap && (
              <div className={styles.mapContainer}>
                <MapContainer 
                  center={[coords.lat, coords.lng]} 
                  zoom={15} 
                  className={styles.leafletMap}
                  scrollWheelZoom={false}
                  minZoom={13}
                  maxBounds={bounds}
                  maxBoundsViscosity={1.0}
                  whenCreated={(mapInstance) => {
                    const el = document.querySelector('.leaflet-container');
                    if (el) el._leaflet_map = mapInstance;
                  }}
                >
                  <TileLayer
                    attribution='© <a href="https://www.esri.com/">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <ChangeMapCenter center={coords} />
                  
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>
                        <div className={styles.popupContent}>
                          <span className={styles.popupCategory}>Your Location</span>
                          <h4 className={styles.popupTitle}>You are here</h4>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {recentRequests?.map((req, index) => {
                    const latOffset = (index - 1) * 0.002;
                    const lngOffset = ((index % 2) - 0.5) * 0.002;
                    return (
                      <Marker 
                        key={req.id} 
                        position={[coords.lat + latOffset, coords.lng + lngOffset]} 
                        icon={requestIcon}
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

                  {selectedCategory && !loadingPlaces && dynamicPlaces.map((place, idx) => (
                    <Marker key={`place-${idx}`} position={[place.lat, place.lng]} icon={placeIcon}>
                      <Popup>
                        <div className={styles.popupContent}>
                          <span className={styles.popupCategory}>{selectedCategory}</span>
                          <h4 className={styles.popupTitle}>{place.name}</h4>
                          {userLocation && (
                            <p style={{ margin: '4px 0', fontSize: '12px', fontWeight: 'bold' }}>
                              {calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)} km away
                            </p>
                          )}
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
            <div className={styles.newsContainer}>
              {loadingNews ? (
                <div className={styles.newsCard}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Fetching latest circulars...</p>
                </div>
              ) : newsList && newsList.length > 0 ? (
                newsList.map((newsItem, idx) => (
                  <div key={idx} className={styles.newsCard}>
                    <Newspaper size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <div className={styles.newsContent}>
                      <h4 style={{ marginBottom: '4px', color: 'var(--color-text-main)', fontSize: '14px' }}>{newsItem.title}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{newsItem.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.newsCard}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No updates available for {localityName} today.</p>
                </div>
              )}
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