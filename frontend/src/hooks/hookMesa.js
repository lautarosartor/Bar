import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { api } from "../services/api";

const useMesa = () => {
  const [mesas, setData] = useState([]);
  const [loadingMesas, setLoading] = useState(false);

  const toast = useToast();

  const crearMesa = async (data) => {
    try {
      const response = await api.mesas.createTable(data);

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

  const actualizarMesa = async (id, data) => {
    try {
      const response = await api.mesas.updateTable(
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

  const getMesas = useCallback(async (q = "") => {
    setLoading(true);

    try {
      const response = await api.mesas.getAllTables(q);

      if (response.status === "success") {
        setData(response.data.mesas || []);
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
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [toast])

  /* useEffect(() => {
    if (!mesas) {
      getMesas();
    }
  }, [mesas, getMesas]); */

  return {
    mesas,
    getMesas,
    loadingMesas,
    crearMesa,
    actualizarMesa,
  }
}

export default useMesa;