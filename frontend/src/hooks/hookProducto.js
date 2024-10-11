import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const useProducto = () => {
  const [productos, setData] = useState([]);
  const [loadingProductos, setLoading] = useState(false);

  const toast = useToast()

  useEffect(() => {
    const callApi = async () => {
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
    }

    callApi();
  }, [toast]);

  return {
    productos,
    loadingProductos
  }
}

export default useProducto;