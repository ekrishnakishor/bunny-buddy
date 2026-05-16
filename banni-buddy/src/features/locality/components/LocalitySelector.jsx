import { useLocalities } from '../hooks/useLocalities.js';
import { useLocalityStore } from '../../../store/useLocalityStore.js';
import styles from './LocalitySelector.module.css';

const LocalitySelector = () => {
  const { data: localities, isLoading, isError } = useLocalities();
  const { localityId, setLocality } = useLocalityStore();

  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setLocality(null, null, null);
      return;
    }
    const selected = localities.find(loc => loc.id === selectedId);
    setLocality(selected.id, selected.name, selected.pincode);
  };

  if (isLoading) return <div className={styles.status}>Loading areas...</div>;
  if (isError) return <div className={styles.status}>Failed to load areas</div>;

  return (
    <div className={styles.container}>
      <label htmlFor="locality-select" className={styles.label}>
        Where are you looking for help?
      </label>
      <select 
        id="locality-select"
        className={styles.select} 
        value={localityId || ''} 
        onChange={handleChange}
      >
        <option value="">Select an area...</option>
        {localities.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name} ({loc.pincode})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocalitySelector;