import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

// Créneaux horaires
export function useTimeSlots() {
  return useQuery({
    queryKey: ['timeslots'],
    queryFn:  async () => {
      const { data } = await api.get('/schedules/timeslots');
      return data.data.timeSlots;
    },
    staleTime: Infinity, // ← ne change jamais, pas besoin de refetch
  });
}

// Emploi du temps d'une classe (admin)
export function useScheduleByClass(classId) {
  return useQuery({
    queryKey: ['schedules', classId],
    queryFn:  async () => {
      const { data } = await api.get(`/schedules?classId=${classId}`);
      return data.data.schedules;
    },
    enabled: !!classId,
  });
}

// Mon emploi du temps (teacher ou student)
export function useMySchedule() {
  return useQuery({
    queryKey: ['schedules', 'me'],
    queryFn:  async () => {
      const { data } = await api.get('/schedules/my');
      return data.data.schedules;
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