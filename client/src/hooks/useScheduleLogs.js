import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

export function useScheduleLogs() {
  return useQuery({
    queryKey: ['logs'],
    queryFn:  async () => {
      const { data } = await api.get('/logs');
      return data.data.logs ?? [];
    },
  });
}

export function useScheduleLogById(id) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn:  async () => {
      const { data } = await api.get(`/logs/${id}`);
      return data.data.log;
    },
    enabled: !!id,
  });
}

export function useManualReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/logs/reset'),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['schedules'] });
      qc.invalidateQueries({ queryKey: ['logs'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success(res.data.message || 'Emploi du temps réinitialisé !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la réinitialisation.');
    },
  });
}