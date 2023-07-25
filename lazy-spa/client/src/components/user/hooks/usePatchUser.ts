import jsonpatch from 'fast-json-patch';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';
import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from 'components/app/hooks/useCustomToast';
import { queryKeys } from 'react-query/constants';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<User, unknown, User, unknown> {
  const toast = useCustomToast();
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient()

  const { mutate: patchUser } = useMutation({
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onMutate: async (newData: User | null) => {
      queryClient.cancelQueries({
        queryKey: [queryKeys.user]
      })
      const prevUserData: User = queryClient.getQueryData([queryKeys.user])
      updateUser(newData)
      return { prevUserData }
    },
    onError: (err, newData, previousUserDataContext) => {
      if (previousUserDataContext) {
        updateUser(previousUserDataContext.prevUserData)
        toast({
          title: "Updates failed. Restoring the previous value",
          status: "warning"
        })
      }
    },
    onSuccess: (userData: User | null) => {
      if (user) {
        updateUser(userData)
        toast({
          title: "User updated!",
          status: "success"
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user]
      })
    }
  })

  return patchUser
}
