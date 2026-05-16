import { NavLink } from 'react-router-dom';
import { Home, HeartHandshake, MessageCircle, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <Home className={styles.icon} strokeWidth={2.5} />
        <span className={styles.label}>Home</span>
      </NavLink>
      <NavLink 
        to="/requests" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <HeartHandshake className={styles.icon} strokeWidth={2.5} />
        <span className={styles.label}>Help</span>
      </NavLink>
      <NavLink 
        to="/guru" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <MessageCircle className={styles.icon} strokeWidth={2.5} />
        <span className={styles.label}>Guru</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <User className={styles.icon} strokeWidth={2.5} />
        <span className={styles.label}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;