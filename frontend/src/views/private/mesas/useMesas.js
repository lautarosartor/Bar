import useQuery from "hooks/useQuery";
import { getAllTables } from "./api";
import { showSuccessToastify } from "utils";

const useMesas = () => {
  const { data, loading, refetch } = useQuery({
    autoFetch: true,
    queryFn: getAllTables,
    onError: (err) => showSuccessToastify({ err }),
  });

  return {
    mesas: data?.data?.mesas,
    loading,
    fetchMesas: refetch,
  }
}

export default useMesas;