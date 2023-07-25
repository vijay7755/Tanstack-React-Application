// import { toast } from '@chakra-ui/react';
import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';
import { createStandaloneToast } from '@chakra-ui/react';
import { theme } from 'theme';

const toast = createStandaloneToast({theme});

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update type for React Query mutate function
// type AppointmentMutationFunction = (appointment: Appointment) => void;

export function useReserveAppointment(): UseMutateFunction<void, unknown, Appointment, unknown> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (appoinment: Appointment) => setAppointmentUser(appoinment, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${queryKeys.appointments}`]
      })
      toast({
        title: "Appoinment booked successfully", 
        status: 'success',
      })
    }
  })

  return mutate
}
