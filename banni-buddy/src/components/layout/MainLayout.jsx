import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;