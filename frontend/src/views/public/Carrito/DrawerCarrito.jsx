import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Input, useDisclosure, useMediaQuery } from "@chakra-ui/react"
import { FaCartShopping } from "react-icons/fa6";

function DrawerCarrito() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 500px)')

  return (
    <>
      <IconButton
        isRound={true}
        h={16} w={16}
        aria-label="Carrito"
        icon={<FaCartShopping fontSize={25} />}
        onClick={onOpen}
        sx={{
          backgroundColor: '#100B00',
          color: '#EFFFC8',
          "&:hover": {
            backgroundColor: '#85CB33',
            color: '#FFF'
          }
        }}
      >
        Open
      </IconButton>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={isMobile ? "bottom" : "right"}
        size={isMobile ? "full" : "sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Carrito de pedidos
          </DrawerHeader>

          <DrawerBody>
            <Input placeholder='Buscar...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme='blue'>
              Pedir
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerCarrito