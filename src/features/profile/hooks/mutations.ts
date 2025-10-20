import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";

import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { useMutation } from "@tanstack/react-query";
import { UpdateProfileData } from "../type";

export const useUpdateAvatar = () =>
  useMutation({
    mutationFn: (input: { id: string; avatar: File }) => {
      const formData = new FormData();
      formData.append("file", input.avatar);
      formData.append("id", input.id);

      return api
        .post(apiEndpoints.users.avatar(input.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: (input: { id: string; password: string }) =>
      api
        .patch(apiEndpoints.users.change_password(input.id), {
          password: input.password,
        })
        .then((res) => res.data),
  });

export const useUserUpdate = () =>
  useMutation({
    mutationFn: (input: UpdateProfileData) =>
      api
        .patch(apiEndpoints.users.update(input.id), sanitizeFlatStrings(input))
        .then((res) => res.data),
  });
