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
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, EditIcon, SettingsIcon, ViewIcon } from '@chakra-ui/icons'
import usePedido from '../../../hooks/hookPedido';
import InputBusqueda from '../../../components/InputBusqueda';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import 'moment/locale/es';

function Pedidos() {
  const { getPedidos, pedidos, loadingPedidos } = usePedido();
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (id) => {
    setSelectedPedidoId(id);
    onOpen();
  }

  useEffect(() => {
    if (!isOpen) {
      getPedidos();
    }
  }, [isOpen, getPedidos]);

  return (
    <TableContainer py={5}>
      <p className="font-bold text-center text-4xl">
        PEDIDOS
      </p>

      <div className="flex gap-5 my-10">
        <InputBusqueda />
      </div>

      <Table
        colorScheme="gray"
        className="shadow shadow-xl"
      >
        <Thead>
          <Tr>
            <Th textAlign="center" width={50}>Lista</Th>
            <Th>Mesa</Th>
            <Th textAlign="center" width={200}>Pedido</Th>
            <Th textAlign="center" width={200}>Entregado</Th>
            <Th textAlign="center" width={100}>Estado</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {pedidos?.length > 0 ? (pedidos.map((p) => (
            <Tr key={p.id}>
              <Td textAlign="center">
                <Tooltip
                  placement="right-start"
                  hasArrow
                  borderRadius={5}
                  fontSize={15}
                  color="#D3FFE9"
                  label={
                    <ul>
                      {p.items?.length > 0 ?
                        (p.items.map((i) => (
                          <>
                            <li key={i.id} className="flex justify-between gap-4 py-2">
                              <p>&#9679; {i.producto.nombre}</p> <span>x{i.cantidad}</span>
                            </li>
                            <hr />
                          </>
                        ))
                      ) : (
                        "No hay items"
                      )}
                      {p.items?.length > 0 && (
                        <li className="flex justify-between font-bold py-2">
                          <span>Total:</span>
                          <span>
                            $ {p.items?.reduce((total, item) => total + item.total, 0)}
                          </span>
                        </li>
                      )}
                    </ul>
                  }
                >
                  <IconButton variant="none" icon={<ViewIcon fontSize={30} />} />
                </Tooltip>
              </Td>

              <Td>
                {p.sesion?.mesa?.nombre_mesa} - {p.sesion?.mesa?.descripcion}
              </Td>

              <Td textAlign="center">
                {moment(p.created_at).fromNow()}
              </Td>

              <Td textAlign="center">
                {p.delivered_at
                  ? moment(p.delivered_at).clone().local().format("HH:mm [h]")
                  : 'No'
                }
              </Td>

              <Td textAlign="center">{p.estado?.descripcion}</Td>

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
                    <MenuItem icon={<CheckIcon />}>
                      Aceptar
                    </MenuItem>
                    <MenuItem icon={<CloseIcon fontSize={10} />}>
                      Rechazar
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>))
          ) : (
            <Tr>
              <Td colSpan={5} textAlign="center">
                {loadingPedidos
                  ? <Spinner />
                  : "Aún no hay pedidos."
                }
              </Td>
            </Tr>
          )}
        </Tbody>

        <TableCaption>
          Tabla de Pedidos
        </TableCaption>
      </Table>
      
      {/*Modal*/}
      {/* <Pedido
        open={isOpen}
        close={onClose}
        productoId={selectedPedidoId}
      /> */}
    </TableContainer>
  )
}

export default Pedidos