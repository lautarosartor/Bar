import { AbsoluteCenter, Box, Divider, Heading, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import BtnCerrarSesion from "./components/BtnCerrarSesion";
import './components/styles.css'
import useCarrito from "./useCarrito";
import React from "react";
import moment from "moment-timezone";

const Sesion = ({ sesion }) => {
  const storedDNI = localStorage.getItem("dni");
  const { carrito } = useCarrito(sesion?.id);
  
  const totalPropio = carrito?.reduce((acc, pedido) => {
    if (storedDNI === pedido.cliente?.dni) {
      pedido.items?.forEach(item => {
        acc += item.subtotal;
      });
    }
    return acc;
  }, 0);

  const totalGrupal = carrito?.reduce((acc, pedido) => {
    return acc + pedido.total;
  }, 0);

  const totalItems = carrito?.reduce((acc, pedido) => {
    pedido.items?.forEach(item => {
      acc += item.cantidad;
    });
    return acc;
  }, 0);
  
  return (
    <Box p={4} zIndex={100}>
      <div className="flex justify-between mb-10">
        <Heading color="#fff">
          Bienvenido a la {sesion?.mesa?.nombre_mesa}
        </Heading>

        <BtnCerrarSesion />
      </div>

      <Box gap={4} p={4} rounded="xl" shadow="xl" minH="30vh" maxW="1000px"
        display="flex" flexDirection="column" justifyContent="space-between"
        backgroundColor="#FFFFFFAA" backdropFilter="blur(1px)"
        className="mx-auto"
      >
        <div className="flex justify-between text-lg font-medium pb-4 border-b-2">
          <Text>Carrito de pedidos en grupo</Text>
          <Text fontWeight="bold">
            Total ${new Intl.NumberFormat('es-ES').format(totalGrupal)}
          </Text>
        </div>

        <Text as="small">
          {totalItems} items en el carrito
        </Text>

        <Box
          gap={4} p={4}
          rounded="xl" minH="30vh"
          display="flex"
          flexDirection="column"
          justifyContent="center" 
          className="fondo-carrito-grupal"
        >
          {carrito?.map((pedido) => (
            <React.Fragment key={pedido.id}>
              {pedido?.items?.map((item) => (
                <Box
                  key={item.id}
                  p={2} rounded="xl"
                  position="relative"
                  display="flex"
                  flexWrap="wrap"
                  flexDirection="column"
                  className="text-[#fff] relative"
                  alignSelf={storedDNI === pedido.cliente?.dni ? "end" : "start"}
                  backgroundColor={storedDNI === pedido.cliente?.dni ? "#005C4B" : "#1f3442"}
                  style={{ maxWidth: '500px' }}
                  sx={{
                    _after: {
                      content: '""',
                      position: 'absolute',
                      top: '0px',
                      [storedDNI === pedido.cliente?.dni ? "right" : "left"]: "-10px",
                      clipPath: `polygon(${storedDNI === pedido.cliente?.dni ? "0 0, 100% 0, 0 100%" : "0 0, 100% 0, 100% 100%"})`,
                      backgroundColor: `${storedDNI === pedido.cliente?.dni ? "#005C4B" : "#1f3442"}`,
                      width: '20px',
                      height: '20px',
                      zIndex: -1,
                    },
                  }}
                >
                  <Box display="flex">
                    <Image 
                      src={item.producto?.img_url} 
                      alt={item.producto?.nombre}
                      h="80px"
                      w="80px"
                      objectFit="cover"
                      objectPosition="left"
                      className="rounded-xl"
                    />

                    <Box className="sm:px-4 px-2">
                      <Text as="small">
                        <i>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</i>
                      </Text>
                      <Text>{item.producto?.nombre}</Text>
                      <Text as="small">{item.producto?.descripcion}</Text>
                    </Box>

                    <Text as="small" fontSize={11} position="absolute" top={0} right={0} paddingEnd={2}>
                      {moment(pedido.created_at).clone().local().format("HH:mm")}
                    </Text>
                  </Box>
                  
                  <Box position="relative" p={4}>
                    <Divider />
                    <AbsoluteCenter display="flex" alignItems="center" rounded="xl" bg="#ffffff40" px={4}>
                      <Text as="small">
                        {pedido?.estado.descripcion}
                        {pedido.delivered_at && ` - ${moment(pedido.delivered_at).clone().local().format("HH:mm")}`}
                      </Text>
                    </AbsoluteCenter>
                  </Box>
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Box>

        <div className="flex align-center justify-between">
          <p className="self-center font-medium">
            Gastos personales <strong>${new Intl.NumberFormat('es-ES').format(totalPropio)}</strong>
          </p>
          {/*Boton del drawer del carrito*/}
          {/* <DrawerCarrito /> */}
        </div>
      </Box>
    </Box>
  );
}

// Validacion de props
Sesion.propTypes = {
  sesion: PropTypes.any,
};

export default Sesion;