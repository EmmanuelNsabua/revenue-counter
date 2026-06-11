import { useQuery } from "@tanstack/react-query";
import { taxesService } from "@/services/taxes";

export const useTaxes = () => {
  return useQuery({
    queryKey: ["taxes"],
    queryFn: taxesService.getAll,
  });
};
