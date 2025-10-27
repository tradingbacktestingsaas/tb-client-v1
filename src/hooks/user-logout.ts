import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () =>
  useMutation({
    mutationFn: () =>
      api.post(apiEndpoints.auth.logout).then((res) => res.data),
  });
