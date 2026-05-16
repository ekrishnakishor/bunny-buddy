import LocalitySelector from '../features/locality/components/LocalitySelector.jsx';
import { useLocalityStore } from '../store/useLocalityStore.js';
import { useLocalityStats } from '../features/locality/hooks/useLocalityStats.js';
import { Users, AlertCircle } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const { localityName } = useLocalityStore();
  const { data: stats } = useLocalityStats();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Namaskara</h1>
        <p className={styles.subtitle}>
          {localityName ? `Showing updates for ${localityName}` : 'Select your locality to see updates'}
        </p>
      </header>

      <LocalitySelector />

      {localityName && stats && (
        <div className={styles.statsContainer}>
          <h2 className={styles.sectionTitle}>Community Pulse</h2>
          <div className={styles.statsGrid}>
            
            <div className={styles.statCard}>
              <div className={styles.iconWrapper} style={{ backgroundColor: '#FDF1F0', color: 'var(--color-danger)' }}>
                <AlertCircle size={24} />
              </div>
              <span className={styles.statValue}>{stats.activeRequests}</span>
              <span className={styles.statLabel}>People need help</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <Users size={24} />
              </div>
              <span className={styles.statValue}>{stats.activeHelpers}</span>
              <span className={styles.statLabel}>Buddies nearby</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;