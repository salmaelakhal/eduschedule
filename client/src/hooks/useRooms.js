import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn:  async () => {
      const { data } = await api.get('/rooms');
      console.log('ROOMS:', data);
      return data.data.rooms ?? data.data ?? [];
    },
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/rooms', body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Salle créée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la création.');
    },
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/rooms/${id}`, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Salle modifiée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification.');
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/rooms/${id}`),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Salle supprimée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });
}