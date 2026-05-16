import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useLocalityStore = create(
  persist(
    (set) => ({
      localityId: null,
      localityName: null,
      pincode: null,
      setLocality: (id, name, pincode) => set({ localityId: id, localityName: name, pincode }),
      clearLocality: () => set({ localityId: null, localityName: null, pincode: null }),
    }),
    {
      name: 'banni-buddy-locality',
      storage: createJSONStorage(() => localStorage),
    }
  )
);