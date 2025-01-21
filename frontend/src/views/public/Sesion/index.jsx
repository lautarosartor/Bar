import { AbsoluteCenter, Box, Divider, Grid, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import './components/styles.css'
import useCarrito from "./useCarrito";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { FaCartShopping } from "react-icons/fa6";
import Carrito from "../Carrito";

const Sesion = ({ sesion }) => {
  const storedDNI = localStorage.getItem("dni");
  const { carrito, fetchCarrito } = useCarrito();
  const bottomRef = useRef(null);
  const [openCarrito, setOpenCarrito] = useState(false);
  
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
    <Box shadow="xl" h="100vh" maxW="1000px" bg="#202C33"
      display="flex" flexDirection="column" mx="auto"
    >
      <Box p={4}>
        <Box className="flex justify-between flex-wrap">
          <Text fontWeight="bold" textColor="#E6EAEC">
            Pedidos en grupo
          </Text>
          <Text color="#AEBAC1">
            Total ${new Intl.NumberFormat('es-ES').format(totalGrupal)}
          </Text>
        </Box>
        <Text as="small" color="#8696A0">
          Mis gastos: <strong>${new Intl.NumberFormat('es-ES').format(totalPropio)}</strong>, {totalItems} items en el carrito
        </Text>
      </Box>

      <Box p={4} className="fondo-carrito-grupal" overflowY="auto">
        {carrito?.map((pedido, index) => (
          <React.Fragment key={index}>
            {pedido?.items?.map((item) => (
              <Box
                key={item.id}
                p={2} m={2} rounded="xl"
                position="relative"
                textColor="#FFF"
                display="flex"
                flexDirection="column"
                justifySelf={storedDNI === pedido?.cliente?.dni ? "end" : "start"}
                backgroundColor={storedDNI === pedido?.cliente?.dni ? "#005C4B" : "#202C33"}
                sx={{
                  maxW: '500px',
                  _after: {
                    content: '""',
                    position: 'absolute',
                    top: '0px',
                    [storedDNI === pedido?.cliente?.dni ? "right" : "left"]: "-10px",
                    clipPath: `polygon(${storedDNI === pedido.cliente?.dni ? "0 0, 100% 0, 0 100%" : "0 0, 100% 0, 100% 100%"})`,
                    backgroundColor: `${storedDNI === pedido.cliente?.dni ? "#005C4B" : "#202C33"}`,
                    width: '20px',
                    height: '20px',
                    zIndex: 1
                  },
                }}
              >
                <Grid templateColumns="80px 1fr">
                  <Image 
                    src={item.producto?.img_url} 
                    alt={item.producto?.nombre}
                    h="80px"
                    w="80px"
                    m="auto"
                    objectFit="cover"
                    objectPosition="left"
                    className="rounded-xl"
                    zIndex={2}
                  />

                  <Box px={2} minW={200}>
                    <Text fontSize={14}>
                      {pedido?.cliente?.nombre} {pedido?.cliente?.apellido}
                    </Text>
                    <Text fontWeight="medium">
                      {item.producto?.nombre}
                    </Text>
                    <Stack spacing={1}>
                      <Text fontSize={11}>
                        {item.producto?.descripcion}
                      </Text>
                    </Stack>
                  </Box>
                </Grid>
                
                <Box position="relative" p={4}>
                  <Divider border="1px solid #009C63" />
                  <AbsoluteCenter display="flex" alignItems="center" rounded="xl" bg="#009C63" px={4}>
                    <Text as="small" whiteSpace="nowrap">
                      {pedido?.estado?.descripcion}
                      {pedido?.delivered_at && ` - ${moment(pedido.delivered_at).clone().local().format("HH:mm")}`}
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

      <Box p={4} textAlign="center" bg="#202C33">
        <IconButton
          isRound={true}
          h={16} w={16}
          aria-label="Carrito"
          icon={<FaCartShopping fontSize={25} />}
          colorScheme="teal"
          onClick={() => setOpenCarrito(true)}
        />
      </Box>
      {openCarrito && 
        <Carrito
          closeDrawer={() => {
            setOpenCarrito(false);
          }}
        />
      }
    </Box>
  );
}

// Validacion de props
Sesion.propTypes = {
  sesion: PropTypes.any,
};

export default Sesion;