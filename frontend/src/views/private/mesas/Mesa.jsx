import { Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import PropTypes from "prop-types";

function Mesa({open, close}) {

  return (
    <Modal
        isOpen={open}
        onClose={close}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Detalles Mesa #
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre de la mesa</FormLabel>
              <Input
                type="text"
                placeholder='Nombre'
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Capacidad</FormLabel>
              <Input
                type="number"
                placeholder='Capacidad'
                min={1} max={20}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                resize={"none"}
                placeholder='Descripción'
              />
            </FormControl>
          </ModalBody>

          <ModalFooter gap={5} justifyContent={"space-between"}>
            <Button colorScheme='blackAlpha' isDisabled={true}>
              QR
            </Button>
            <div className="flex gap-5">
              <Button colorScheme='blue' isDisabled={true}>
                Guardar
              </Button>
              <Button onClick={close}>
                Cancelar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

// Validacion de props
Mesa.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.any,
};

export default Mesa