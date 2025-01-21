import { AddIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useProductos from "views/private/productos/useProductos";

const Carrito = ({ closeDrawer }) => {
  const [isMobile] = useMediaQuery("(max-width: 550px)", { ssr: false });
  const { productos, onSearch } = useProductos();
  const [cantidad, setCantidad] = useState({});

  const aumentarCantidad = (id) => {
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [id]: prevCantidad[id] + 1,
    }));
  };

  const disminuirCantidad = (id) => {
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [id]: Math.max(prevCantidad[id] - 1, 0),
    }));
  };

  useEffect(() => {
    if (productos?.length) {
      setCantidad(
        productos?.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
      );
    }
  }, [productos]);

  return (
    <Drawer
      isOpen={true}
      onClose={closeDrawer}
      size={isMobile ? "full" : "sm"}
      placement={isMobile ? "bottom" : "right"}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Carrito de pedidos</DrawerHeader>

        <DrawerBody>
          <Box display="flex" gap={2}>
            <InputGroup>
              <Input
                placeholder="Buscar..."
                onChange={(e) => onSearch(e.target.value, "")}
              />
              <InputRightElement>
                <SearchIcon />
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box my={10} display="flex" flexDirection="column" gap={4}>
            {productos?.map((item) => (
              <Grid key={item.id} templateColumns="80px 1fr 100px" gap={2}>
                <Image
                  src={item.img_url}
                  alt={item.nombre}
                  h="80px"
                  w="80px"
                  objectFit="cover"
                  objectPosition="left"
                  className="rounded-xl"
                />

                <Box>
                  <Text fontWeight="medium">{item.nombre}</Text>
                  <Text as="small">{item.descripcion}</Text>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  <Text fontWeight="medium" color="#009C63">
                    ${item.precio}
                  </Text>
                  <Box>
                    <IconButton
                      size="sm"
                      icon={<MinusIcon fontSize={10} />}
                      roundedLeft="xl"
                      roundedRight="none"
                      onClick={() => disminuirCantidad(item.id)}
                    />
                    <Button
                      size="sm"
                      rounded="none"
                      width={25}
                      isDisabled
                      style={{ cursor: "default" }}
                    >
                      {cantidad[item.id]}
                    </Button>
                    <IconButton
                      size="sm"
                      icon={<AddIcon fontSize={10} />}
                      roundedRight="xl"
                      roundedLeft="none"
                      onClick={() => aumentarCantidad(item.id)}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={4} onClick={closeDrawer}>
            Cerrar
          </Button>
          <Button colorScheme="blue">Pedir</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// Validacion de props
Carrito.propTypes = {
  closeDrawer: PropTypes.func,
};

export default Carrito;
