import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Namaskara</h1>
        <p className={styles.subtitle}>Select your locality to see updates</p>
      </header>
    </div>
  );
};

export default Home;