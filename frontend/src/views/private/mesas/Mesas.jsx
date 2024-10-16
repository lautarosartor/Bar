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
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import useMesa from '../../../hooks/hookMesa';
import Mesa from './Mesa';
import BtnAgregar from '../../../components/BtnAgregar';
import BtnBusqueda from '../../../components/BtnBusqueda';

function Mesas() {
  const { mesas, loadingMesas } = useMesa();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <TableContainer>
      <p className="font-bold text-center text-4xl">
        MESAS
      </p>

      <div className="flex gap-5 my-5">
        <BtnAgregar />
        <BtnBusqueda />
      </div>

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
                <Menu>
                  <MenuButton
                    as={IconButton}
                    isRound={true}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='solid'
                  />
                  <MenuList boxShadow='lg'>
                    <MenuItem onClick={onOpen} icon={<EditIcon />}>
                      Ver
                    </MenuItem>
                  </MenuList>
                </Menu>
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

      {/*Modal*/}
      <Mesa open={isOpen} close={onClose} />
    </TableContainer>
  )
}

export default Mesas