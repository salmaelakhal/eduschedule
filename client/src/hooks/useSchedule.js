import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

// Créneaux horaires
export function useTimeSlots() {
  return useQuery({
    queryKey: ['timeslots'],
    queryFn:  async () => {
      const { data } = await api.get('/schedules/timeslots');
      return data.data ?? []; // ← data.data directement, pas data.data.timeSlots
    },
    staleTime: Infinity,
  });
}

// Emploi du temps d'une classe (admin)
export function useScheduleByClass(classId) {
  return useQuery({
    queryKey: ['schedules', classId],  // ← manquait !
    queryFn: async () => {
      const { data } = await api.get(`/schedules?classId=${classId}`);
      console.log('SCHEDULES RAW:', JSON.stringify(data));
      return data.data.schedules ?? data.data ?? [];
    },
    enabled: !!classId,
  });
}

export function useMySchedule() {
  return useQuery({
    queryKey: ['schedules', 'me'],
    queryFn:  async () => {
      const { data } = await api.get('/schedules/my');
      console.log('MY SCHEDULE RESPONSE:', data); // ← log temporaire
      return data.data.schedules ?? data.data ?? [];
    },
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/schedules', body),
    onSuccess:  (_, variables) => {
      qc.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Séance ajoutée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    },
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/schedules/${id}`),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Séance supprimée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });
}