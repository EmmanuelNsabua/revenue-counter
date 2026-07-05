import { useQuery } from "@tanstack/react-query";
import { referencesService } from "@/services/references";

export const useStructures = () => {
  return useQuery({
    queryKey: ["structures"],
    queryFn: () => referencesService.getStructures(),
  });
};
