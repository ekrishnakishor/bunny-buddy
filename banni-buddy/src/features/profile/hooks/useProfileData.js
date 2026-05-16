import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useAuthStore } from '../../../store/useAuthStore.js';

export const useMyRequests = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_requests')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });
};

export const useMyConversations = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['my-conversations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          helper_id,
          profiles (username), 
          help_requests (
            id, 
            title, 
            created_by,
            profiles (username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });
};

export const useResolveRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (requestId) => {
      const { error } = await supabase
        .from('help_requests')
        .update({ status: 'resolved' })
        .eq('id', requestId)
        .eq('created_by', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['recent-requests'] });
    }
  });
};