import { Box, Grid, IconButton, Image, Tag, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import './components/styles.css'
import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { FaCartShopping } from "react-icons/fa6";
import Carrito from "../Carrito";
import Chat from "./Chat";
import usePedidos from "./usePedidos";
import { disconnectSocket, initiateSocket, subscribeToChat } from "./Chat/useSocket";

const Sesion = ({ sesion }) => {
  const storedDNI = localStorage.getItem("dni");
  const { pedidos, fetchPedidos } = usePedidos();
  const [openCarrito, setOpenCarrito] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const totalPropio = pedidos?.reduce((acc, pedido) => {
    if (storedDNI === pedido?.cliente?.dni) {
      acc += pedido?.items?.reduce((itemAcc, item) => itemAcc + item.subtotal, 0);
    }
    return acc;
  }, 0);
  
  const totalGrupal = pedidos?.reduce((acc, pedido) => acc + (pedido?.total || 0), 0);
  
  const totalItems = pedidos?.reduce((acc, pedido) => {
    acc += pedido?.items?.reduce((itemAcc, item) => itemAcc + (item?.cantidad || 0), 0);
    return acc;
  }, 0);

  useEffect(() => {
    if (!sesion?.id) return;

    fetchPedidos(sesion.id);
    initiateSocket(sesion.id);

    subscribeToChat((err, msg) => {
      if (err) return console.error(err);

      console.log('Mensaje recibido:', msg);

      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      disconnectSocket();
    };
  }, [sesion?.id]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pedidos, messages]);
  
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
          Mis gastos: <strong>${new Intl.NumberFormat('es-ES').format(totalPropio)}</strong>, {totalItems} items en el pedidos
        </Text>
      </Box>

      <Box p={4} className="fondo-pedidos-grupal" overflowY="auto">
        {pedidos?.map((pedido, index) => (
          <React.Fragment key={index}>
            {pedido?.items?.map((item) => (
              <Box key={item.id} m={2}>
                <Box
                  p={2} gap={2}
                  rounded="xl"
                  color="#FFF"
                  position="relative"
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
                      width: '10px',
                      height: '10px',
                      zIndex: 1
                    },
                    [storedDNI === pedido?.cliente?.dni ? "roundedTopRight" : "roundedTopLeft"]: "none",
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
                      <Text fontSize={12}>
                        {pedido?.cliente?.nombre} {pedido?.cliente?.apellido}
                      </Text>
                      <Text fontSize={16} fontWeight="medium">
                        {item.producto?.nombre}
                      </Text>
                      <Text fontSize={11} className="leading-5">
                        {item.producto?.descripcion}
                      </Text>
                    </Box>
                  </Grid>

                  <Tag
                    size="sm"
                    rounded="xl"
                    textColor="#FFF"
                    alignSelf="center"
                    bg={
                      pedido.estado?.descripcion === 'Pendiente' ? 'gray.500'
                      : pedido.estado?.descripcion === 'Entregado' ? 'green.500'
                      : pedido.estado?.descripcion === 'En preparación' ? 'yellow.500' : 'red.500'
                    }
                  >
                    {pedido?.estado?.descripcion}
                    {pedido?.delivered_at && ` - ${moment(pedido.delivered_at).clone().local().format("HH:mm")}`}
                  </Tag>

                  <Text
                    fontSize={11}
                    fontWeight="bold"
                    position="absolute"
                    bottom={1}
                    left={2}
                  >
                    x{item.cantidad}
                  </Text>

                  <Text
                    fontSize={11}
                    fontWeight="light"
                    color="gray.200"
                    position="absolute"
                    bottom={1}
                    right={2}
                  >
                    {moment(pedido.created_at).clone().local().format("HH:mm")}
                  </Text>
                </Box>
              </Box>
            ))}
          </React.Fragment>
        ))}
        {messages.map((msg, index) => (
          <Box key={index} m={2}>
            <Grid
              px={1} rounded="md"
              templateColumns="1fr 30px"
              position="relative"
              textColor="#FFF"
              justifySelf={storedDNI === msg?.sender ? "end" : "start"}
              backgroundColor={storedDNI === msg?.sender ? "#005C4B" : "#202C33"}
              sx={{
                maxW: '500px',
                minH: '33px',
                _after: {
                  content: '""',
                  position: 'absolute',
                  top: '0px',
                  [storedDNI === msg?.sender ? "right" : "left"]: "-10px",
                  clipPath: `polygon(${storedDNI === msg?.sender ? "0 0, 100% 0, 0 100%" : "0 0, 100% 0, 100% 100%"})`,
                  backgroundColor: `${storedDNI === msg?.sender ? "#005C4B" : "#202C33"}`,
                  width: '10px',
                  height: '10px',
                  zIndex: 1
                },
                [storedDNI === msg?.sender ? "roundedTopRight" : "roundedTopLeft"]: "none",
              }}
            >
              <Text
                p={1}
                fontSize={14}
                color="#FFF"
                whiteSpace="wrap"
                wordBreak="break-word"
              >
                {msg.text}
              </Text>
              <Text
                fontSize={11}
                fontWeight="light"
                color="gray.200"
                justifySelf="end"
                alignSelf="end"
              >
                {moment(msg.time).clone().local().format("HH:mm")}
              </Text>
            </Grid>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box
        p={4} gap={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#202C33"
      >
        <Box>
          <IconButton
            isRound={true}
            h={10} w={10}
            aria-label="Carrito"
            icon={<FaCartShopping fontSize={20} />}
            colorScheme="teal"
            onClick={() => setOpenCarrito(true)}
          />
        </Box>
        <Chat
          room={sesion.id}
          messages={messages}
          setMessages={setMessages}
          sender={storedDNI}
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