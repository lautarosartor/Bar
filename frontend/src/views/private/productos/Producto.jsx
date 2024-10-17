import { Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Spinner, Textarea, useToast } from "@chakra-ui/react"
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
import { api } from "../../../services/api";
import useProducto from "../../../hooks/hookProducto";

function Producto({open, close, productoId}) {
  const { crearProducto, actualizarProducto } = useProducto();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEditar, setModoEditar] = useState(false);
  const toast = useToast();

  // Estados locales para los valores editables
  const initForm = useState({
    idsubcategoria: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    img_url: '',
  });

  const [formState, setFormState] = useState(initForm);

  // Estado para rastrear los campos modificados
  const [modifiedFields, setModifiedFields] = useState([]);

  // Detectamos si estamos creando o editando
  const modoCrear = !productoId;

  // Actualiza los estados locales cuando cambia `data`
  useEffect(() => {
    if (data) {
      setFormState({
        idsubcategoria: data.idsubcategoria || 0,
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        precio: data.precio || 0,
        stock: data.stock || 0,
        img_url: data.img_url || ''
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
      // Verifica si el campo es "precio" y convierte a float
      if (field === "precio") {
        acc[field] = parseFloat(formState[field]) || 0; // Convierte a float o asigna 0 si no es un número
      }
      else if (field === "stock") {
        acc[field] = parseInt(formState[field]) || 0; // Convierte a float o asigna 0 si no es un número
      }
      else {
        acc[field] = formState[field];
      }
      return acc;
    }, {});
    
    // Consumimos el hook
    if (modoCrear) {
      // Modo creacion
      await crearProducto(updatedData);
    }
    else {
      // Modo edicion
      await actualizarProducto(productoId, updatedData);
    }
    
    setTimeout(() => {
      setModifiedFields([]);
      setFormState(initForm);
      setModoEditar(false);
      close();
    }, 500);
  }

  useEffect(() => {
    const leerProducto = async () => {
      try {
        const response = await api.productos.getProduct(productoId);

        if (response.status === "success") {
          setData(response.data.producto);
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
      leerProducto();
    }
  }, [open, productoId, modoCrear, toast]);


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
            ? "Crear Producto"
            : (modoEditar ? `Editar Producto #${data?.id}` : `Detalles Producto #${data?.id}`)
          }
        </ModalHeader>

        <ModalCloseButton />

        {data || modoCrear ? (
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre del Producto</FormLabel>
              <Input
                type="text"
                name="nombre" // El nombre del campo debe coincidir con el del estado
                placeholder="Nombre"
                maxLength={45}
                isReadOnly={!modoEditar && !modoCrear}
                value={formState.nombre || ''}
                onChange={handleOnChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Subcategoría</FormLabel>
              <Input
                type="number"
                placeholder="Subcategoría"
                isReadOnly={!modoCrear}
                value={formState.idsubcategoria || 0} // No editable
                onChange={handleOnChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                resize="none"
                name="descripcion" // Nombre coincide con el del estado
                placeholder="Descripción"
                maxLength={200}
                isReadOnly={!modoEditar && !modoCrear}
                value={formState.descripcion || ''}
                onChange={handleOnChange}
              />
            </FormControl>
            <div className="flex gap-6 mt-4">
              <FormControl mt={4}>
                <FormLabel>Precio</FormLabel>
                <InputGroup>
                  <InputLeftElement color="gray.300" fontSize="1.2em">
                    $
                  </InputLeftElement>
                  <Input
                    type="number"
                    name="precio" // Nombre coincide con el del estado
                    placeholder="Precio"
                    isReadOnly={!modoEditar && !modoCrear}
                    value={formState.precio || ''}
                    onChange={handleOnChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  name="stock" // Nombre coincide con el del estado
                  placeholder="Stock"
                  isReadOnly={!modoEditar && !modoCrear}
                  value={formState.stock || ''}
                  onChange={handleOnChange}
                />
              </FormControl>
            </div>

            <FormControl mt={4}>
              <FormLabel>Imagen</FormLabel>
              <Input
                type="text"
                name="img_url" // Nombre coincide con el del estado
                placeholder="URL imagen"
                maxLength={255}
                isReadOnly={!modoEditar && !modoCrear}
                value={formState.img_url || ''}
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
Producto.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.any,
  productoId: PropTypes.number,
};

export default Producto