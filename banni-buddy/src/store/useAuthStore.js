import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  isInitialized: false, // Prevents UI flickering before Supabase checks the session
  setSession: (session) => set({ 
    session, 
    user: session?.user || null,
    isInitialized: true 
  }),
  signOut: () => set({ session: null, user: null }),
}));