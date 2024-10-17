import { Button, FormControl, FormLabel, Input, Spinner, Textarea, useToast } from "@chakra-ui/react"
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
import useMesa from "../../../hooks/hookMesa";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";

function Mesa({open, close, mesaId}) {
  const { crearMesa, actualizarMesa } = useMesa();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEditar, setModoEditar] = useState(false);
  const toast = useToast();

  // Estados locales para los valores editables
  const initForm = useState({
    nombre_mesa: '',
    capacidad: 0,
    codigo_qr: '',
    descripcion: '',
  });

  const [formState, setFormState] = useState(initForm);

  // Estado para rastrear los campos modificados
  const [modifiedFields, setModifiedFields] = useState([]);

  // Detectamos si estamos creando o editando
  const modoCrear = !mesaId;

  // Actualiza los estados locales cuando cambia `data`
  useEffect(() => {
    if (data) {
      setFormState({
        nombre_mesa: data.nombre_mesa || '',
        capacidad: data.capacidad || 0,
        codigo_qr: data.codigo_qr || '',
        descripcion: data.descripcion || '',
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
      // Verifica si el campo es "capacidad" y convierte a int
      if (field === "capacidad") {
        acc[field] = parseInt(formState[field]) || 0; // Convierte a int o asigna 0 si no es un número
      }
      else {
        acc[field] = formState[field];
      }
      return acc;
    }, {});
    
    // Consumimos el hook
    if (modoCrear) {
      // Modo creacion
      await crearMesa(updatedData);
    }
    else {
      // Modo edicion
      await actualizarMesa(mesaId, updatedData);
    }
    
    setTimeout(() => {
      setModifiedFields([]);
      setFormState(initForm);
      setModoEditar(false);
      close();
    }, 500);
  }

  useEffect(() => {
    const leerMesa = async () => {
      try {
        const response = await api.mesas.getTable(mesaId);

        if (response.status === "success") {
          setData(response.data.mesa);
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
      leerMesa();
    }
  }, [open, mesaId, modoCrear, toast]);

  const handleClose = () => {
    setFormState(initForm);
    setModoEditar(false);
    close();
  }

  return (
    <Modal
      isOpen={open}
      onClose={close}
    >
      <ModalOverlay />
      
      <ModalContent>
        <ModalHeader>
          {modoCrear
            ? "Crear Mesa"
            : (modoEditar ? `Editar Mesa #${data?.id}` : `Detalles Mesa #${data?.id}`)
          }
        </ModalHeader>

        <ModalCloseButton />

        {data || modoCrear ? (
          <ModalBody pb={6}>
            <div className="flex gap-6 mt-4">
              <FormControl>
                <FormLabel>Nombre de la mesa</FormLabel>
                <Input
                  type="text"
                  name="nombre_mesa"
                  placeholder='Nombre'
                  maxLength={5}
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.nombre_mesa || ''}
                  onChange={handleOnChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Capacidad</FormLabel>
                <Input
                  type="number"
                  name="capacidad"
                  placeholder="Capacidad"
                  min={1}
                  max={20}
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.capacidad || ''}
                  onChange={handleOnChange}
                />
              </FormControl>
            </div>

            <FormControl mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                resize={"none"}
                name="descripcion"
                placeholder='Descripción'
                maxLength={45}
                isReadOnly={!modoEditar && !modoCrear}
                value={formState.descripcion || ''}
                onChange={handleOnChange}
              />
            </FormControl>
          </ModalBody>
        ) : (
          loading && (
            <ModalBody pb={6}>
              <Spinner />
            </ModalBody>
          )
        )}

        <ModalFooter gap={5} justifyContent={modoCrear ? "end" : "space-between"}>
          {!modoCrear &&
            <Button colorScheme='blackAlpha' isDisabled={true}>
              QR
            </Button>
          }

          <div className="flex gap-5">
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
  mesaId: PropTypes.number,
};

export default Mesa