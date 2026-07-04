import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usersApi, { CreateUserPayload, UserPayload } from "@/lib/api/users";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    select: (data) => data.data || [],
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserPayload }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};