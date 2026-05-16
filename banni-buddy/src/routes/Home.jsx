import { useState } from 'react';
import LocalitySelector from '../features/locality/components/LocalitySelector.jsx';
import { useLocalityStore } from '../store/useLocalityStore.js';
import { useLocalityStats } from '../features/locality/hooks/useLocalityStats.js';
import { 
  Users, AlertCircle, Radio, GitCommit, Bug, 
  Map as MapIcon, EyeOff, Thermometer, Wind, 
  Shield, ShoppingBag, Film, Bus, PlusCircle, Newspaper 
} from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const { localityName } = useLocalityStore();
  const { data: stats } = useLocalityStats();
  
  // State to toggle the map visibility
  const [showMap, setShowMap] = useState(true);

  // Quick navigation categories
  const quickLinks = [
    { name: 'Police', icon: Shield, color: '#1E4D2B' },
    { name: 'Hospitals', icon: PlusCircle, color: '#D9381E' },
    { name: 'Bus Stops', icon: Bus, color: '#2B6CB0' },
    { name: 'Malls', icon: ShoppingBag, color: '#D69E2E' },
    { name: 'Theatres', icon: Film, color: '#805AD5' },
  ];

  return (
    <div className={styles.page}>
      
      {/* Top Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusItem}>
          <Radio size={14} className={styles.liveIcon} />
          <span>System Live</span>
        </div>
        <div className={styles.statusGroup}>
          <div className={styles.statusItem} title="Commits">
            <GitCommit size={14} />
            <span>v1.0 (42)</span>
          </div>
          <div className={styles.statusItem} title="Known Bugs">
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
          
          {/* Environment & Pulse Grid */}
          <div className={styles.envGrid}>
            <div className={styles.envCard}>
              <Thermometer size={20} color="var(--color-primary)" />
              <div className={styles.envData}>
                <span className={styles.envValue}>28°C</span>
                <span className={styles.envLabel}>Sunny</span>
              </div>
            </div>
            <div className={styles.envCard}>
              <Wind size={20} color="#2B6CB0" />
              <div className={styles.envData}>
                <span className={styles.envValue}>45 AQI</span>
                <span className={styles.envLabel}>Good</span>
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

          {/* Quick Navigation Menu */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Search Nearby</h2>
            <div className={styles.quickNavGrid}>
              {quickLinks.map((link) => (
                <button key={link.name} className={styles.quickNavItem}>
                  <link.icon size={24} color={link.color} />
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Neighborhood Map</h2>
              <button 
                className={styles.toggleButton} 
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? <><EyeOff size={16} /> Hide</> : <><MapIcon size={16} /> Show</>}
              </button>
            </div>
            
            {showMap && (
              <div className={styles.mapContainer}>
                <iframe
                  title="Locality Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(localityName + " Bengaluru")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
                <div className={styles.mapOverlay}>
                  <span>Interactive Pins Coming Soon</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent News/Activity Placeholder */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Updates</h2>
            <div className={styles.newsCard}>
              <Newspaper size={20} color="var(--color-primary)" />
              <div className={styles.newsContent}>
                <h4>Power cut scheduled</h4>
                <p>BESCOM has announced a scheduled outage tomorrow from 10 AM to 2 PM in sectors 3 and 4.</p>
              </div>
            </div>
          </div>

          {/* Call to Actions (Disabled for now) */}
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