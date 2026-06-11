import { useQuery } from "@tanstack/react-query";
import { commercantsService } from "@/services/commercants";

export const useCommercants = (search?: string) => {
  return useQuery({
    queryKey: ["commercants", search],
    queryFn: () => commercantsService.getAll(search),
  });
};

export const useCommercant = (id: string | number) => {
  return useQuery({
    queryKey: ["commercant", id],
    queryFn: () => commercantsService.getById(id),
    enabled: !!id,
  });
};
