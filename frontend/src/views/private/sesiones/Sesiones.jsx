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
import useSesion from '../../../hooks/hookSesion';
import "moment/locale/es";
import moment from "moment-timezone";
import './sesiones.css'
import BtnAgregar from '../../../components/BtnAgregar';
import BtnBusqueda from '../../../components/BtnBusqueda';

function Sesiones() {
  const { sesiones, loadingSesiones } = useSesion();

  return (
    <TableContainer>
      <p className="font-bold text-center text-4xl">
        SESIONES
      </p>

      <div className="flex gap-5 my-5">
        <BtnAgregar />
        <BtnBusqueda />
      </div>

      <Table
        variant="simple"
        colorScheme="gray"
        className="border shadow shadow-xl"
      >
        <Thead>
          <Tr>
            <Th textAlign="center" width={50}>Estado</Th>
            <Th>Mesa de la sesión</Th>
            <Th textAlign="center">Iniciada</Th>
            <Th textAlign="center">Finalizada</Th>
            <Th textAlign="center" width={50}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {sesiones?.length > 0 ? (sesiones.map((s) => (
            <Tr key={s.id} className={!s.activo ? 'bg-[#A5CBC330]' : 'bg-[#85CB3330]'}>
              <Td textAlign="center">
                {s.activo
                  ? (
                    <span className="circulo-estado circulo-animacion"
                      style={{
                        backgroundColor: '#85CB33',
                        boxShadow: '0 0 5px green'
                      }}
                    />
                  ) : (
                    <span className="circulo-estado"
                      style={{
                        backgroundColor: 'gray',
                      }}
                    />
                  )
                }
              </Td>

              <Td>{s.mesa.nombre_mesa}</Td>

              <Td textAlign="center">{moment(s.created_at).clone().local().format("HH:mm [h]")}</Td>

              <Td textAlign="center">
                {s.finished_at
                  ? moment(s.finished_at).clone().local().format("HH:mm [h]")
                  : "En curso..."
                }
              </Td>

              <Td textAlign="center">
                <IconButton isRound={true} aria-label='options' bg="none" icon={<HamburgerIcon />} />
              </Td>
            </Tr>))
          ) : (
            <Tr>
              <Td colSpan={5} textAlign="center">
                {loadingSesiones
                  ? <Spinner />
                  : "Aún no hay sesiones."
                }
              </Td>
            </Tr>
          )}
        </Tbody>

        <TableCaption>
          Tabla de Sesiones
        </TableCaption>
      </Table>
    </TableContainer>
  )
}

export default Sesiones