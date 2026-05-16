import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useLocalityStore } from '../../../store/useLocalityStore.js';
import { useAuthStore } from '../../../store/useAuthStore.js';

export const useRequests = () => {
  const { localityId } = useLocalityStore();

  return useQuery({
    queryKey: ['requests', localityId],
    queryFn: async () => {
      if (!localityId) return [];
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          *,
          profiles:created_by (username, avatar_url, reputation_score)
        `)
        .eq('locality_id', localityId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!localityId,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { localityId } = useLocalityStore();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (newRequest) => {
      const { data, error } = await supabase
        .from('help_requests')
        .insert([{
          ...newRequest,
          locality_id: localityId,
          created_by: user.id,
        }]);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['requests', localityId]);
    },
  });
};