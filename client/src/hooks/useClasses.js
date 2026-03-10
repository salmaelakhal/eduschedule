import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../api';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn:  async () => {
      const { data } = await api.get('/classes');
      return data.data.classes;
    },
  });
}

export function useClass(id) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn:  async () => {
      const { data } = await api.get(`/classes/${id}`);
      return data.data.class;
    },
    enabled: !!id,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/classes', body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Classe créée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la création.');
    },
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/classes/${id}`, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Classe modifiée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification.');
    },
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/classes/${id}`),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Classe supprimée !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });
}

export function useAddStudentToClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, studentId }) =>
      api.post(`/classes/${classId}/students/${studentId}`),
    onSuccess: (_, { classId }) => {
      qc.invalidateQueries({ queryKey: ['classes', classId] });
      toast.success('Étudiant ajouté !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    },
  });
}

export function useRemoveStudentFromClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, studentId }) =>
      api.delete(`/classes/${classId}/students/${studentId}`),
    onSuccess: (_, { classId }) => {
      qc.invalidateQueries({ queryKey: ['classes', classId] });
      toast.success('Étudiant retiré !');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors du retrait.');
    },
  });
}