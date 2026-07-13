import { useQuery } from "@tanstack/react-query";
import { commercantsService } from "@/services/commercants";

export const useCommercants = (filters?: { search?: string; zone?: string; status?: string; structure_ids?: number[] }) => {
  return useQuery({
    queryKey: ["commercants", filters],
    queryFn: () => commercantsService.getAll(filters),
  });
};

export const useCommercant = (id: string | number) => {
  return useQuery({
    queryKey: ["commercant", id],
    queryFn: () => commercantsService.getById(id),
    enabled: !!id,
  });
};
