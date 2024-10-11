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
import useMesa from '../../../hooks/hookMesa';

function Mesas() {
  const { mesas, loadingMesas } = useMesa();

  return (
    <TableContainer>
      <Table
        variant="striped"
        colorScheme="gray"
        className="border shadow shadow-xl"
      >
        <Thead>
          <Tr>
            <Th>Mesa</Th>
            <Th textAlign="center">Descripción</Th>
            <Th textAlign="center">Capacidad</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {mesas?.length > 0 ? (mesas.map((m) => (
            <Tr key={m.id}>
              <Td>{m.nombre_mesa}</Td>

              <Td textAlign="center">{m.descripcion}</Td>

              <Td textAlign="center">{m.capacidad}</Td>

              <Td textAlign="center">
                <IconButton aria-label='options' bg="none" icon={<HamburgerIcon />} />
              </Td>
            </Tr>))
          ) : (
            <Tr>
              <Td colSpan={4} textAlign="center">
                {loadingMesas
                  ? <Spinner />
                  : "Aún no hay mesas."
                }
              </Td>
            </Tr>
          )}
        </Tbody>

        <TableCaption>
          Tabla de Mesas
        </TableCaption>
      </Table>
    </TableContainer>
  )
}

export default Mesas