import { useToast } from "@chakra-ui/react";

export const publicOptions = (method, body) => ({
  method,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

export const privateOptions = (method, body) => ({
  method,
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

export const showSuccessToastify = ({ res }) => {
  useToast.toast.success((res || "Acción exitosa"), {
    status: 'success',
    duration: 4000,
    isClosable: true,
    position: 'top-center',
  });
};

export const showErrorToastify = ({ err }) => {
  useToast.toast.error((err || "Error"), {
    status: 'error',
    duration: 4000,
    isClosable: true,
    position: 'top-center',
  });
};
