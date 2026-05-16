import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useAuthStore } from '../../../store/useAuthStore.js';

export const useStartConversation = () => {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (requestId) => {
      if (!user) throw new Error("You must be logged in to reply.");

      // 1. Check if a conversation already exists for this request + helper combo
      const { data: existing, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('request_id', requestId)
        .eq('helper_id', user.id)
        .maybeSingle(); // maybeSingle doesn't throw an error if zero rows are found

      if (fetchError) throw new Error(fetchError.message);
      
      // If it exists, just return its ID so we can navigate to it
      if (existing) return existing.id;

      // 2. If it doesn't exist, create a new conversation room
      const { data: newConvo, error: insertError } = await supabase
        .from('conversations')
        .insert([{ request_id: requestId, helper_id: user.id }])
        .select('id')
        .single();

      if (insertError) throw new Error(insertError.message);
      
      return newConvo.id;
    }
  });
};