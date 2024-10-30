import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { api } from "../services/api";

const useUsuario = () => {
  const [usuarios, setData] = useState([]);
  const [loadingUsuarios, setLoading] = useState(false);
  const toast = useToast();

  const crearUsuario = async (data) => {
    try {
      const response = await api.auth.register(data);

      if (response.status === "success") {
        setTimeout(() => {
          toast({
            title: response.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }, 700);
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  const actualizarUsuario = async (id, data) => {
    try {
      const response = await api.usuarios.updateUser(
        id,
        data
      );

      if (response.status === "success") {
        setTimeout(() => {
          toast({
            title: response.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }, 700);
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  const getUsuarios = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.usuarios.getAllUsers();

      if (response.status === "success") {
        setData(response.data.usuarios || []);
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: `${error.message}. Intentalo de nuevo más tarde.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
    } finally {
      setLoading(false);
    }
  }, [toast])

  return {
    usuarios,
    getUsuarios,
    loadingUsuarios,
    crearUsuario,
    actualizarUsuario,
  }
}

export default useUsuario;