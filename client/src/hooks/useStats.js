import { useQuery } from '@tanstack/react-query';
import api from '../api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn:  async () => {
      const { data } = await api.get('/stats');
      return data.data;
    },
    staleTime: 0, // ← était 30_000, met à 0
  });
}