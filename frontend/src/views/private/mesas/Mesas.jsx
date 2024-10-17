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
  MenuItem,
  Button
} from '@chakra-ui/react'
import { AddIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import useMesa from '../../../hooks/hookMesa';
import Mesa from './Mesa';
import BtnBusqueda from '../../../components/BtnBusqueda';
import { useEffect, useState } from 'react';

function Mesas() {
  const { getMesas, mesas, loadingMesas } = useMesa();
  const [selectedMesaId, setSelectedMesaId] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (id) => {
    setSelectedMesaId(id);
    onOpen();
  }

  useEffect(() => {
    if (!isOpen) {
      getMesas();
    }
  }, [isOpen, getMesas]);

  return (
    <TableContainer>
      <p className="font-bold text-center text-4xl">
        MESAS
      </p>

      <div className="flex gap-5 my-5">
        <Button
          onClick={() => handleOpenModal(0)}
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
                    <MenuItem onClick={() => handleOpenModal(m.id)} icon={<EditIcon />}>
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
      <Mesa
        open={isOpen}
        close={onClose}
        mesaId={selectedMesaId}
      />
    </TableContainer>
  )
}

export default Mesas