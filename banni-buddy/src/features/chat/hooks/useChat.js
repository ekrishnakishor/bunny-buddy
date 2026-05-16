import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';
import { useAuthStore } from '../../../store/useAuthStore.js';
import { useEffect } from 'react';

// Fetch messages and subscribe to live updates
export const useChatMessages = (conversationId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // Listen for new messages in this specific chat room
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${conversationId}` 
      }, () => {
        // When a new message hits the database, instantly refresh the UI
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`*, profiles:sender_id(username)`)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!conversationId,
  });
};

// Send a new message
export const useSendMessage = () => {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ conversationId, content }) => {
      const { error } = await supabase
        .from('messages')
        .insert([{ conversation_id: conversationId, sender_id: user.id, content }]);
      if (error) throw new Error(error.message);
    }
  });
};