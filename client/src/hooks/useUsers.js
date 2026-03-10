import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

// ── Queries ──
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn:  async () => {
      const { data } = await api.get('/users');
      console.log('USERS:', data);
      return data.data.users ?? data.data ?? [];
    },
  });
}

// ── Mutations ──
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/users', body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur créé !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la création.');
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/users/${id}`, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur modifié !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification.');
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur supprimé !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });
}