import CustomModal from "components/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";

const Checkout = ({ closeModal, sesion, message200, message400, loading }) => {
  const navigate = useNavigate();
  const sesionID = localStorage.getItem("sesionID");

  useEffect(() => {
    if (!sesion?.id) return;

    if (sesionID != sesion?.id) {
      localStorage.setItem("sesionID", sesion?.id);
      closeModal();
    }
    else {
      closeModal();
    }
  }, [sesion?.id, sesionID, closeModal]);
  
  return (
    <CustomModal
      isOpen={true}
      onClose={() => {
        closeModal();
        navigate(-1);
      }}
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
  sesion: PropTypes.any,
  message200: PropTypes.string,
  message400: PropTypes.string,
  loading: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default Checkout;