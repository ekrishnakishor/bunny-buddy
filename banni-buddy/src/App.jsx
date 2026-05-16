import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './routes/Home.jsx';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default App;