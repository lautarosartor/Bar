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
  useDisclosure
} from '@chakra-ui/react'
import { EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import useUsuario from '../../../hooks/hookUsuario';
import Usuario from './Usuario';
import BtnAgregar from '../../../components/BtnAgregar';
import BtnBusqueda from '../../../components/BtnBusqueda';

function Usuarios() {
  const { usuarios, loadingUsuarios} = useUsuario();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <TableContainer>
      <p className="font-bold text-center text-4xl">
        USUARIOS
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
            <Th textAlign="center" width={50}>#</Th>
            <Th>Nombre y Apellido</Th>
            <Th>Email</Th>
            <Th>Telefono</Th>
            <Th textAlign="center" width={100}>Rol</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {usuarios?.length > 0 ? (usuarios.map((u) => (
            <Tr key={u.id}>
              <Td textAlign="center">{u.id}</Td>

              <Td>{u.nombre} {u.apellido}</Td>

              <Td>{u.email}</Td>

              <Td>{u.telefono}</Td>

              <Td textAlign="center">{u.rol.nombre}</Td>

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
              <Td colSpan={6} textAlign="center">
                {loadingUsuarios
                  ? <Spinner />
                  : "Aún no hay usuarios."
                }
              </Td>
            </Tr>
          )}
        </Tbody>

        <TableCaption>
          Tabla de Usuarios
        </TableCaption>
      </Table>

      {/*Modal*/}
      <Usuario open={isOpen} close={onClose} />
    </TableContainer>
  )
}

export default Usuarios