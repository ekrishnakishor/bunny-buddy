import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase.js';

const fetchLocalities = async () => {
  const { data, error } = await supabase
    .from('localities')
    .select('*')
    .order('name');
  
  if (error) throw new Error(error.message);
  return data;
};

export const useLocalities = () => {
  return useQuery({
    queryKey: ['localities'],
    queryFn: fetchLocalities,
    staleTime: 1000 * 60 * 60 * 24,
  });
};