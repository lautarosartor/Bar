import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

function ModalIdentificacion() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    const storedApellido = localStorage.getItem("apellido");

    // Si no existen en localStorage, abrimos el modal
    if (!storedNombre || !storedApellido) {
      onOpen();
    }
  }, [onOpen]);

  const handleGuardar = () => {
    if (nombre.trim() === "" || apellido.trim() === "") {
      return;
    } else {
      // Guardamos los datos en localStorage
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("apellido", apellido);

      // Cerramos el modal
      onClose();
    }
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Identificate</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              ref={initialRef}
              isRequired
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Apellido</FormLabel>
            <Input
              isRequired
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleGuardar}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalIdentificacion