import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn:  async () => {
      const { data } = await api.get('/subjects');
      console.log('SUBJECTS:', data);
      return data.data.subjects ?? data.data ?? [];
    },
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/subjects', body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Matière créée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la création.');
    },
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/subjects/${id}`, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Matière modifiée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification.');
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/subjects/${id}`),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Matière supprimée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });
}