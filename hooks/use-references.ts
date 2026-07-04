import { useQuery } from "@tanstack/react-query";
import { referencesService } from "@/services/references";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: referencesService.getRoles,
  });
};

export const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: referencesService.getGrades,
  });
};

export const useStructures = () => {
  return useQuery({
    queryKey: ["structures"],
    queryFn: referencesService.getStructures,
  });
};
