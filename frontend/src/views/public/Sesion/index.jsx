import { AbsoluteCenter, Box, Divider, Heading, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import './components/styles.css'
import useCarrito from "./useCarrito";
import React, { useEffect, useRef } from "react";
import moment from "moment-timezone";
import DrawerCarrito from "../Carrito/DrawerCarrito";

const Sesion = ({ sesion }) => {
  const storedDNI = localStorage.getItem("dni");
  const { carrito, fetchCarrito } = useCarrito();
  const bottomRef = useRef(null);
  
  const totalPropio = carrito?.reduce((acc, pedido) => {
    if (storedDNI === pedido?.cliente?.dni) {
      acc += pedido?.items?.reduce((itemAcc, item) => itemAcc + item.subtotal, 0);
    }
    return acc;
  }, 0);
  
  const totalGrupal = carrito?.reduce((acc, pedido) => acc + (pedido?.total || 0), 0);
  
  const totalItems = carrito?.reduce((acc, pedido) => {
    acc += pedido?.items?.reduce((itemAcc, item) => itemAcc + (item?.cantidad || 0), 0);
    return acc;
  }, 0);

  useEffect(() => {
    if (!sesion?.id) return;

    fetchCarrito(sesion.id);
  }, [sesion?.id]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [carrito]);
  
  return (
    <Box>
      <div className="flex justify-between mb-10">
        <Heading color="#fff">
          Bienvenido a la {sesion?.mesa?.nombre_mesa}
        </Heading>

        {/* <BtnCerrarSesion /> */}
      </div>

      <Box gap={4} p={4} rounded="xl" shadow="xl" minH="30vh" maxW="1000px"
        display="flex" flexDirection="column" justifyContent="space-between"
        backgroundColor="#FFFFFFAA"
        className="mx-auto"
      >
        <div className="flex justify-between flex-wrap text-lg font-black pb-4 gap-4 border-b-2">
          <Text textColor="#009C63">Carrito de pedidos en grupo</Text>
          <Text>
            Total ${new Intl.NumberFormat('es-ES').format(totalGrupal)}
          </Text>
        </div>

        <Text>
          Mis gastos: <strong>${new Intl.NumberFormat('es-ES').format(totalPropio)}</strong>
        </Text>

        <Text as="small">
          {totalItems} items en el carrito
        </Text>

        <Box rounded="xl" height="60vh" className="fondo-carrito-grupal">
          <Box h="100%" p={4} overflowY="auto">
            {carrito?.map((pedido) => (
              <React.Fragment key={pedido.id}>
                {pedido?.items?.map((item) => (
                  <Box
                    key={item.id}
                    p={2} m={2} rounded="xl"
                    position="relative"
                    textColor="#FFF"
                    display="flex"
                    flexDirection="column"
                    justifySelf={storedDNI === pedido.cliente?.dni ? "end" : "start"}
                    backgroundColor={storedDNI === pedido.cliente?.dni ? "#005C4B" : "#1f3442"}
                    sx={{
                      maxW: '500px',
                      _after: {
                        content: '""',
                        position: 'absolute',
                        top: '0px',
                        [storedDNI === pedido.cliente?.dni ? "right" : "left"]: "-10px",
                        clipPath: `polygon(${storedDNI === pedido.cliente?.dni ? "0 0, 100% 0, 0 100%" : "0 0, 100% 0, 100% 100%"})`,
                        backgroundColor: `${storedDNI === pedido.cliente?.dni ? "#005C4B" : "#1f3442"}`,
                        width: '20px',
                        height: '20px',
                        zIndex: 1
                      },
                    }}
                  >
                    <Box display="flex" flexWrap="wrap">
                      <Image 
                        src={item.producto?.img_url} 
                        alt={item.producto?.nombre}
                        h="80px"
                        w="80px"
                        m="auto"
                        objectFit="cover"
                        objectPosition="left"
                        className="rounded-xl"
                      />

                      <Box px={2} minW={200}>
                        <Text as="small">
                          <i>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</i>
                        </Text>
                        <Text fontWeight="medium">{item.producto?.nombre}</Text>
                        <Text as="small" fontSize={11}>{item.producto?.descripcion}</Text>
                      </Box>
                    </Box>
                    
                    <Box position="relative" p={4}>
                      <Divider border="1px solid #009C63" />
                      <AbsoluteCenter display="flex" alignItems="center" rounded="xl" bg="#009C63" px={4}>
                        <Text as="small" whiteSpace="nowrap">
                          {pedido?.estado.descripcion}
                          {pedido.delivered_at && ` - ${moment(pedido.delivered_at).clone().local().format("HH:mm")}`}
                        </Text>
                      </AbsoluteCenter>
                      <Text as="small" fontSize={11} position="absolute" bottom={-1} left={0}>
                        x{item.cantidad}
                      </Text>
                      <Text as="small" fontSize={11} position="absolute" bottom={-1} right={0}>
                        {moment(pedido.created_at).clone().local().format("HH:mm")}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </React.Fragment>
            ))}
            <div ref={bottomRef} />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <DrawerCarrito />
        </Box>
      </Box>
    </Box>
  );
}

// Validacion de props
Sesion.propTypes = {
  sesion: PropTypes.any,
};

export default Sesion;