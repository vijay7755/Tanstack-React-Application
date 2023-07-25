import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): (appointment: Appointment) => void {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: removeAppointmentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.appointments]
      })
      const toast = useCustomToast()
      toast({ title: "Deleted appoinments successfully", status: "success" })
    }
  })
  
  return mutate
}
