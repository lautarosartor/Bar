import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const useUsuario = () => {
  const [usuarios, setData] = useState([]);
  const [loadingUsuarios, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const callApi = async () => {
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
    usuarios,
    loadingUsuarios
  }
}

export default useUsuario;