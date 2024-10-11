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
  IconButton
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import useProducto from '../../../hooks/hookProducto';

function Productos() {
  const { productos, loadingProductos } = useProducto();

  return (
    <TableContainer>
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
                <IconButton aria-label='options' bg="none" icon={<HamburgerIcon />} />
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
    </TableContainer>
  )
}

export default Productos