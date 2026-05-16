import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useLocalityStore } from '../../../store/useLocalityStore.js';

export const useLocalityStats = () => {
  const { localityId } = useLocalityStore();

  return useQuery({
    queryKey: ['locality-stats', localityId],
    queryFn: async () => {
      if (!localityId) return null;

      // Ask Supabase to just count the open requests for this locality
      const { count, error } = await supabase
        .from('help_requests')
        .select('*', { count: 'exact', head: true })
        .eq('locality_id', localityId)
        .eq('status', 'open');

      if (error) throw new Error(error.message);

      return {
        activeRequests: count || 0,
        // Since we don't have an "active users" tracker yet, 
        // we simulate local community size based on request volume to make it feel alive!
        activeHelpers: Math.floor((count || 0) * 2.5) + 12 
      };
    },
    enabled: !!localityId,
  });
};