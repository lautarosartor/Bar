import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Spinner,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Tooltip,
  Box,
  Image
} from '@chakra-ui/react'
import { EditIcon, SettingsIcon } from '@chakra-ui/icons'
import useProducto from '../../../hooks/hookProducto';
import Producto from './Producto';
import InputBusqueda from '../../../components/InputBusqueda';
import { useEffect, useState } from 'react';
import BtnAgregar from '../../../components/BtnAgregar';

function Productos() {
  const { getProductos, productos, loadingProductos } = useProducto();
  const [selectedProductoId, setSelectedProductoId] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (id) => {
    setSelectedProductoId(id);
    onOpen();
  }

  useEffect(() => {
    if (!isOpen) {
      getProductos();
    }
  }, [isOpen, getProductos]);

  return (
    <TableContainer py={5}>
      <p className="font-bold text-center text-4xl">
        PRODUCTOS
      </p>

      <div className="flex gap-5 my-10">
        <BtnAgregar onClick={() => handleOpenModal(0)} />
        <InputBusqueda />
      </div>

      <Table
        colorScheme="gray"
        className="shadow shadow-xl"
      >
        <Thead>
          <Tr>
            <Th textAlign="center" width={100}>Imagen</Th>
            <Th>Producto</Th>
            <Th textAlign="center" width={200}>Precio</Th>
            <Th textAlign="center" width={200}>Stock</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {productos?.length > 0 ? (productos.map((p) => (
            <Tr key={p.id}>
              <Td maxWidth={100} py={1}>
                <Tooltip
                  placement="right-start"
                  label={
                    <Image 
                      src={p.img_url} 
                      alt={p.nombre}
                      maxH="250px" // Ajusta el tamaño que desees
                      objectFit="contain" // Mantiene la proporción de la imagen
                      borderRadius="5px"
                      objectPosition="left"
                    />
                  }
                  backgroundColor="transparent"
                  boxShadow="none"
                  display="flex"
                  justifyContent="center"
                >
                  <Box display="flex" justifyContent="center">
                    <Image 
                      src={p.img_url} 
                      alt={p.nombre} 
                      maxW="60px" 
                      maxH="60px" 
                    />
                  </Box>
                </Tooltip>
              </Td>

              <Td>{p.nombre}</Td>

              <Td textAlign="center">$ {p.precio}</Td>

              <Td textAlign="center">{p.stock}</Td>

              <Td textAlign="center">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    isRound={true}
                    aria-label='Options'
                    icon={<SettingsIcon />}
                    variant='solid'
                  />
                  <MenuList boxShadow='lg'>
                    <MenuItem onClick={() => handleOpenModal(p.id)} icon={<EditIcon />}>
                      Ver
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>))
          ) : (
            <Tr>
              <Td colSpan={5} textAlign="center">
                {loadingProductos
                  ? <Spinner />
                  : "Aún no hay productos."
                }
              </Td>
            </Tr>
          )}
        </Tbody>

        <TableCaption>
          Tabla de Productos
        </TableCaption>
      </Table>
      
      {/*Modal*/}
      <Producto
        open={isOpen}
        close={onClose}
        productoId={selectedProductoId}
      />
    </TableContainer>
  )
}

export default Productos