import useQuery from "hooks/useQuery";
import { getSesion } from "./api";
import queryString from "query-string";
import { useEffect } from "react";
import { showErrorToastify } from "utils";
import { useToast } from "@chakra-ui/react";

const useSesion = (mesaQR, clienteDni) => {
  const toast = useToast();
  const { data, refetch, loading, error } = useQuery({
    autoFetch: false,
    queryFn: getSesion,
    onError: (err) => showErrorToastify({ toast, err }),
  });

  const fetch = (mesaQR, clienteDni) => {
    const query = queryString.stringify({
      mesa: mesaQR,
      dni: clienteDni,
    });

    refetch(query);
  }

  useEffect(() => {
    if (!mesaQR || !clienteDni) return;

    fetch(mesaQR, clienteDni);
  }, [mesaQR, clienteDni]);

  return {
    sesion: data?.data?.sesion,
    message200: data?.message,
    message400: error?.message,
    loading,
    fetchSesion: refetch,
  }
}

export default useSesion;