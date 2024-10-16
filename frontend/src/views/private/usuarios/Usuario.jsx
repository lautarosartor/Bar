import { PhoneIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
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
import { useState } from "react";

function Usuario({open, close}) {

  const [show, setShow] = useState(false);

  return (
    <Modal
        isOpen={open}
        onClose={close}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Detalles Usuario #
          </ModalHeader>
          
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Input
                type="number"
                placeholder='Rol'
                isDisabled
              />
            </FormControl>

            <div className="flex gap-6 mt-4">
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  placeholder='Nombre'
                />
              </FormControl>

              <FormControl>
                <FormLabel>Apellido</FormLabel>
                <Input
                  type="text"
                  placeholder='Apellido'
                />
              </FormControl>
            </div>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder='Email'
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder='Contraseña'
                />
                <InputRightElement>
                  <Button onClick={() => setShow(!show)}>
                    {show
                      ? <ViewIcon />
                      : <ViewOffIcon />
                    }
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Celular</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <PhoneIcon color='gray.300' />
                </InputLeftElement>
                <Input type='number' placeholder='Celular' />
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter gap={5}>
            <Button colorScheme='blue' isDisabled={true}>
              Guardar
            </Button>
            <Button onClick={close}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

// Validacion de props
Usuario.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.any,
};

export default Usuario