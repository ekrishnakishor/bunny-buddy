import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Home</span>
      </NavLink>
      <NavLink 
        to="/requests" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <span className={styles.icon}>🤝</span>
        <span className={styles.label}>Help</span>
      </NavLink>
      <NavLink 
        to="/kannada" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <span className={styles.icon}>🗣️</span>
        <span className={styles.label}>Kannada</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <span className={styles.icon}>👤</span>
        <span className={styles.label}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;