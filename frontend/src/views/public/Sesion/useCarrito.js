import useQuery from "hooks/useQuery";
import { getCarrito } from "./api";
import { useToast } from "@chakra-ui/react";
import { showErrorToastify } from "utils";

const useCarrito = (sesionId) => {
  const toast = useToast();

  const { data, refetch, loading } = useQuery({
    autoFetch: true,
    queryFn: getCarrito,
    onError: (err) => showErrorToastify({ toast, err }),
    args: [sesionId],
  });

  return {
    carrito: data?.data?.carrito,
    loading,
    fetchCarrito: refetch,
  }
}

export default useCarrito;