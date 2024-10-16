import { CloseIcon, SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useState } from "react"

function BtnBusqueda() {
  const [show, setShow] = useState(false);

  return (
    <InputGroup width={250}>
      <Input
        pr='3rem'
        type="text"
        placeholder='Búsqueda'
      />
      <InputRightElement width='3rem'>
        <Button h='2rem' size='sm' onClick={() => setShow(!show)}>
          {show
            ? <CloseIcon />
            : <SearchIcon />
          }
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export default BtnBusqueda