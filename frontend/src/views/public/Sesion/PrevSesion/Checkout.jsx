import CustomModal from "components/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import useSesion from "../useSesion";

const Checkout = ({ closeModal, mesaQR, clienteID }) => {
  const navigate = useNavigate();
  const sesionID = localStorage.getItem("sesionID");
  const { sesion, message200, message400, loading } = useSesion(mesaQR, clienteID);

  useEffect(() => {
    if (!sesion?.id) return;

    if (!sesionID || (sesionID != sesion?.id)) {
      localStorage.setItem("sesionID", sesion?.id);
      closeModal();
    }
    else {
      closeModal();
    }
  }, [sesion, sesionID]);

  if (sesion && !message400 && !loading) {
    setTimeout(() => {
      closeModal();
    }, 1000);
  }
  
  return (
    <CustomModal
      isOpen={true}
      onClose={() => navigate(-1)}
      title="A un paso de entrar"
      onOk={!sesion && !message400 ? () => closeModal() : undefined}
      okText="Crear sesión"
      closeText="Volver"
      closeOnEsc={false}
      confirmLoading={loading}
    >
      {!sesion && !message400 &&
        <Text>{message200}</Text>
      }

      {message400
        ? <Text>{message400}</Text>
        : (!message200 &&
          <div className="flex items-center gap-2">
            <Text>Entrando...</Text>
            <Spinner speed='1s' size='xs' />
          </div>
        )
      }
    </CustomModal>
  );
}

// Validacion de props
Checkout.propTypes = {
  closeModal: PropTypes.func,
  mesaQR: PropTypes.string,
  clienteID: PropTypes.any,
};

export default Checkout;