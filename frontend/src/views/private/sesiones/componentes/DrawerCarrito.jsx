import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Input, useDisclosure } from "@chakra-ui/react"
import { FaCartShopping } from "react-icons/fa6";

function DrawerCarrito() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        isRound={true}
        h={16} w={16}
        colorScheme="teal"
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
        placement='right'
        onClose={onClose}
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
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerCarrito