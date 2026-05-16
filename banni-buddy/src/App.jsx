import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase.js';
import { useAuthStore } from './store/useAuthStore.js';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './routes/Home.jsx';
import Profile from './routes/Profile.jsx';
import Help from './routes/Help.jsx';
import CreateRequest from './routes/CreateRequest.jsx';
import ChatRoom from './routes/ChatRoom.jsx';

const App = () => {
  const { setSession, isInitialized } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (!isInitialized) return null; 

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/requests" element={<Help />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;