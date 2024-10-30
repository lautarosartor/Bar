import { PhoneIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, InputGroup, Spinner, InputLeftElement, useToast } from "@chakra-ui/react"
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
import { useEffect, useState } from "react";
import useUsuario from "../../../hooks/hookUsuario";
import { api } from "../../../services/api";

function Usuario({open, close, usuarioId}) {
  const { crearUsuario, actualizarUsuario } = useUsuario();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEditar, setModoEditar] = useState(false);
  const toast = useToast();

  // Estados locales para los valores editables
  const initForm = useState({
    idrol: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });

  const [formState, setFormState] = useState(initForm);

  // Estado para rastrear los campos modificados
  const [modifiedFields, setModifiedFields] = useState([]);

  // Detectamos si estamos creando o editando
  const modoCrear = !usuarioId;

  // Actualiza los estados locales cuando cambia `data`
  useEffect(() => {
    if (data) {
      setFormState({
        idrol: data.idrol || 0,
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        email: data.email || '',
        telefono: data.telefono || ''
      });
    }
  }, [data]);

  // Función para manejar los cambios en los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // Añade el campo modificado a `modifiedFields` si no está ya allí
    if (!modifiedFields.includes(name)) {
      setModifiedFields((prevFields) => [...prevFields, name]);
    }
  }

  const handleUpdate = async () => {
    // Filtra y construye un objeto con solo los campos modificados
    const updatedData = modifiedFields.reduce((acc, field) => {
      if (field === "idrol") {
        acc[field] = parseInt(formState[field]) || 0;
      }
      else {
        acc[field] = formState[field];
      }
      return acc;
    }, {});
    
    // Consumimos el hook
    if (modoCrear) {
      // Modo creacion
      await crearUsuario(updatedData);
    }
    else {
      // Modo edicion
      await actualizarUsuario(usuarioId, updatedData);
    }
    
    setTimeout(() => {
      setModifiedFields([]);
      setFormState(initForm);
      setModoEditar(false);
      close();
    }, 500);
  }

  useEffect(() => {
    const leerUsuario = async () => {
      try {
        const response = await api.usuarios.getUser(usuarioId);

        if (response.status === "success") {
          setData(response.data.usuario);
        }
        else {
          throw new Error(response.message);
        }
        setLoading(false);
      } catch (error) {
        toast({
          title: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }
    }

    if (open && !modoCrear) {
      leerUsuario();
    }
  }, [open, usuarioId, modoCrear, toast]);


  const handleClose = () => {
    setFormState(initForm);
    setModoEditar(false);
    close();
  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
        {modoCrear
          ? "Crear Usuario"
          : (modoEditar ? `Editar Usuario #${data?.id}` : `Detalles Usuario #${data?.id}`)
        }
        </ModalHeader>
        
        <ModalCloseButton />

        {data || modoCrear ? (
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Input
                type="number"
                name="idrol"
                placeholder="Rol"
                isReadOnly={true}
                value={formState.idrol || ''}
                onChange={handleOnChange}
              />
            </FormControl>

            <div className="flex gap-6 mt-4">
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.nombre || ''}
                  onChange={handleOnChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Apellido</FormLabel>
                <Input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.apellido || ''}
                  onChange={handleOnChange}
                />
              </FormControl>
            </div>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                isReadOnly={true}
                value={formState.email || ''}
                onChange={handleOnChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Celular</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <PhoneIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="number"
                  name="telefono"
                  placeholder="Celular"
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.telefono || ''}
                  onChange={handleOnChange}
                />
              </InputGroup>
            </FormControl>
          </ModalBody>
        ) : (
          loading && (
            <ModalBody pb={6}>
              <Spinner />
            </ModalBody>
          )
        )}

        <ModalFooter gap={5} justifyContent="end">
          {modoCrear ? (
            <Button colorScheme='blue' onClick={handleUpdate}>
              Crear
            </Button>
          ) : modoEditar ? (
            <Button colorScheme='blue' onClick={handleUpdate}>
              Guardar
            </Button>
          ) : (
            <Button colorScheme='blue' onClick={() => setModoEditar(true)}>
              Editar
            </Button>
          )}
          <Button onClick={handleClose}>
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
  usuarioId: PropTypes.number,
};

export default Usuario