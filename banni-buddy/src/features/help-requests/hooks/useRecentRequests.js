import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useLocalityStore } from '../../../store/useLocalityStore.js';

export const useRecentRequests = () => {
  const { localityId } = useLocalityStore();

  return useQuery({
    queryKey: ['recent-requests', localityId],
    queryFn: async () => {
      if (!localityId) return [];

      const { data, error } = await supabase
        .from('help_requests')
        .select('id, title, category, urgency, created_at')
        .eq('locality_id', localityId)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!localityId,
  });
};