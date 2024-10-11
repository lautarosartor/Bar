import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const useMesa = () => {
  const [mesas, setData] = useState([]);
  const [loadingMesas, setLoading] = useState(false);

  const toast = useToast()

  useEffect(() => {
    const callApi = async () => {
      setLoading(true);
  
      try {
        const response = await api.mesas.getAllTables();
  
        if (response.status === "success") {
          setData(response.data.mesas || []);
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
    mesas,
    loadingMesas
  }
}

export default useMesa;