import { useState } from 'react'
import { useApi, showMessage } from 'utils/helpers'

export function useConfigurations() {
  const api = useApi()
  const [configurations, setConfigurations] = useState([])
  const [configurationsLoading, setConfigurationsLoading] = useState(false)

  const getConfigurations = () => {
    setConfigurationsLoading(true)
    api
      .getConfigurations()
      .then((result) => {
        if (result.kind === 'ok') {
          setConfigurations(result.response.results)
        } else {
          showMessage('Ocurrió un error al intentar obtener las configuraciones.')
          return []
        }
      })
      .catch((err) => {
        showMessage(err.message)
        return []
      })
      .finally(() => setConfigurationsLoading(false))
  }

  const saveConfigurations = (data) => {
    setConfigurationsLoading(true)
    api.updateConfigurations(data).handle({
      successMessage: 'Configuraciones guardadas exitosamente',
      errorMessage: 'Error al intentar guardar las configuraciones',
      onFinally: () => setConfigurationsLoading(false),
    })
  }

  //
  return { configurations, configurationsLoading, getConfigurations, saveConfigurations }
}
