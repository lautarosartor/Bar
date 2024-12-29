import { useEffect, useState } from "react";
import useQuery from "hooks/useQuery";
import queryString from "query-string";
import { getAllProducts } from "./api";
import { showErrorToastify } from "utils";
import { useToast } from "@chakra-ui/react";

const useProductos = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true
  });
  const [sorting, setSorting] = useState({
    field: "",
    order: ""
  });
  const toast = useToast();

  const { data, loading, refetch } = useQuery({
    autoFetch: false,
    queryFn: getAllProducts,
    onError: (err) => showErrorToastify({ toast, err }),
  });

  const fetch = () => {
    const query = queryString.stringify({
      limit: pagination.pageSize,
      page: pagination.current,
      sortField: sorting.field,
      sortOrder: sorting.order === "ascend" ? "ASC" : "DESC",
    });

    refetch(query);
  }

  const onTableChange = (pagination, _, sorting) => {
    setPagination(ps => ({ ...ps, ...pagination }))
    setSorting(sorting)
  };

  useEffect(() => {
    fetch();
  }, [pagination, sorting]);

  return {
    productos: data?.data?.productos,
    loading,
    fetchProductos: fetch,
    onTableChange,
  }
}

export default useProductos;