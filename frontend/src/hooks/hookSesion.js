import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const useSesion = () => {
  const [sesiones, setData] = useState([]);
  const [loadingSesiones, setLoading] = useState(false);

  const toast = useToast()

  useEffect(() => {
    const callApi = async () => {
      setLoading(true);
  
      try {
        const response = await api.sesiones.getAllSesiones();
  
        if (response.status === "success") {
          setData(response.data.sesiones || []);
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
    }

    callApi();
  }, [toast]);

  return {
    sesiones,
    loadingSesiones
  }
}

export default useSesion;