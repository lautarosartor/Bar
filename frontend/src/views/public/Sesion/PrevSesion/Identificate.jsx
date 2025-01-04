import { FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import CustomModal from "components/Modal";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToastify, showSuccessToastify } from "utils";

const Identificate = ({ closeModal }) => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const toast = useToast();

  const handleSave = () => {
    if (nombre.trim() === "" || apellido.trim() === "") {
      showErrorToastify({ toast, err: "Completá el formulario con tus Datos." });
      return;
    }
    else {
      // Guardamos los datos en localStorage
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("apellido", apellido);
      localStorage.setItem("dni", dni);

      showSuccessToastify({ toast, res: "¡Datos guardados correctamente!" });
      setTimeout(() => {
        closeModal();
      }, 700);
    }
  }

  return (
    <CustomModal
      isOpen={true}
      onClose={() => navigate(-1)}
      title="Identificate"
      onOk={() => handleSave()}
      closeText="Volver"
      as="form"
      closeOnEsc={false}
    >
      <FormControl isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nombre || ''}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <FormControl isRequired mt={4}>
        <FormLabel>Apellido</FormLabel>
        <Input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={apellido || ''}
          onChange={(e) => setApellido(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel color="#aaa">Documento</FormLabel>
        <Input
          type="text"
          name="dni"
          placeholder="DNI"
          value={dni || ''}
          onChange={(e) => setDni(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <Text textAlign="center" marginTop=".5rem">
        Estos datos usaremos para identificarte
      </Text>
    </CustomModal>
  );
}

// Validacion de props
Identificate.propTypes = {
  closeModal: PropTypes.func,
};

export default Identificate;