import useQuery from "hooks/useQuery";
import { getSesion } from "./api";
import queryString from "query-string";
import { useEffect } from "react";

const useSesion = (mesaQR, clienteID) => {
  const { data, refetch, loading, error } = useQuery({
    autoFetch: false,
    queryFn: getSesion,
    // onError: (err) => showErrorToastify({ toast, err }),
  });

  const fetch = (mesaQR, clienteID) => {
    const query = queryString.stringify({
      mesa: mesaQR,
      cliente: clienteID,
    });

    refetch(query);
  }

  useEffect(() => {
    fetch(mesaQR, clienteID);
  }, [mesaQR, clienteID]);

  return {
    sesion: data?.data?.sesion,
    message200: data?.message,
    message400: error?.message,
    loading,
    fetchSesion: refetch,
  }
}

export default useSesion;