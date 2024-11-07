import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { api } from "../services/api";

const usePedido = () => {
  const [pedidos, setData] = useState([]);
  const [loadingPedidos, setLoading] = useState(false);
  const toast = useToast();

  const crearPedido = async (data) => {
    try {
      const response = await api.pedidos.createOrder(data);

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

  const getPedidos = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.pedidos.getAllOrders();

      if (response.status === "success") {
        setData(response.data.pedidos || []);
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
    pedidos,
    getPedidos,
    loadingPedidos,
    crearPedido,
  }
}

export default usePedido;