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
  Button
} from '@chakra-ui/react'
import { AddIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import useProducto from '../../../hooks/hookProducto';
import Producto from './Producto';
import BtnBusqueda from '../../../components/BtnBusqueda';
import { useEffect, useState } from 'react';

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
    <TableContainer>
      <p className="font-bold text-center text-4xl">
        PRODUCTOS
      </p>

      <div className="flex gap-5 my-5">
        <Button onClick={() => handleOpenModal(0)}
          leftIcon={<AddIcon />}
          variant='solid'
          colorScheme='green'
        >
        Agregar
      </Button>
        <BtnBusqueda />
      </div>

      <Table
        variant="striped"
        colorScheme="gray"
        className="border shadow shadow-xl"
      >
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th textAlign="center" width={200}>Precio</Th>
            <Th textAlign="center" width={200}>Stock</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {productos?.length > 0 ? (productos.map((p) => (
            <Tr key={p.id}>
              <Td>{p.nombre}</Td>

              <Td textAlign="center">$ {p.precio}</Td>

              <Td textAlign="center">{p.stock}</Td>

              <Td textAlign="center">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    isRound={true}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
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
              <Td colSpan={4} textAlign="center">
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