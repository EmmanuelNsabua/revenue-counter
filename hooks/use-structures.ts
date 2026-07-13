import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { structuresService, CreateStructureDTO, UpdateStructureDTO } from "@/services/structures";

export const useStructures = () => {
  return useQuery({
    queryKey: ["structures"],
    queryFn: () => structuresService.getAll(),
  });
};

export const useStructure = (id: number) => {
  return useQuery({
    queryKey: ["structures", id],
    queryFn: () => structuresService.getById(id),
    enabled: !!id,
  });
};

export const useCreateStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStructureDTO) => structuresService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
    },
  });
};

export const useUpdateStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStructureDTO }) => structuresService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      queryClient.invalidateQueries({ queryKey: ["structures", variables.id] });
    },
  });
};

export const useDeleteStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => structuresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
    },
  });
};
