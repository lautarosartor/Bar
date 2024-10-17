import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { api } from "../services/api";

const useProducto = () => {
  const [productos, setData] = useState([]);
  const [loadingProductos, setLoading] = useState(false);
  const toast = useToast();

  const crearProducto = async (data) => {
    try {
      const response = await api.productos.createProduct(data);

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

  const actualizarProducto = async (id, data) => {
    try {
      const response = await api.productos.updateProduct(
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

  const getProductos = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.productos.getAllProducts();

      if (response.status === "success") {
        setData(response.data.productos || []);
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
        position: 'bottom',
      })
    } finally {
      setLoading(false);
    }
  }, [toast])

  /* useEffect(() => {
    // Con esto se soluciona la ejecucion de 8932348 veces la consulta
    if (!productos) {
      getProductos();
    }
  }, [productos, getProductos]); */

  return {
    productos,
    getProductos,
    loadingProductos,
    crearProducto,
    actualizarProducto,
  }
}

export default useProducto;