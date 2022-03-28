import { useMutation, useQuery, useQueryClient } from 'react-query'
import request from '../../api'
import { useSnackbar } from 'notistack'
import { useLocation } from '../useLocation'

export const getCombo = () => {
  const { isLoading, data, error } = useQuery('/api/combo', () =>
    request.combo.get(),
    {
      refetchInterval: 5000
    }
  )
  return {
    isLoading,
    dataC: data?.data || [],
    error
  }
}

export const mutateCombo = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setPath } = useLocation()
  const { mutate: mutateC , isLoading, error } = useMutation(
    payload =>
      payload?.id ? request.combo.put(payload) : request.combo.post(payload),
    {
      onSuccess: data => {
        if (data?.data) {
          enqueueSnackbar(`Combo ${data?.message}`, {
            variant: 'success'
          })
          setPath('/product')
        }
      }
    }
  )
  return {
    isLoading,
    error,
    mutateC
  }
}

export const destroyCombo = () => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    mutate: destroyC,
    isLoading,
    error
  } = useMutation(payload => request.combo.deleteC(payload), {
    onSuccess: data => {
      if (data?.data) {
        enqueueSnackbar(`Combo ${data?.message}`, {
          variant: 'success'
        })
      }
    }
  })

  return {
    isLoading,
    error,
    destroyC
  }
}
