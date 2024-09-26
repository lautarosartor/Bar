import { Button, Collapse, useDisclosure } from '@chakra-ui/react'
import logo from '../assets/logo.png'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import './components.css'

function Header() {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <nav className="bg-[#3B341F] text-[#EFFFC8]">
      <div className="md:flex container mx-auto p-6 items-center justify-between hidden">
        <img src={logo} className="w-16" alt="logo" />
        <ul className="flex gap-6">
          <li>
            <a href="#home">
              Home
            </a>
          </li>
          <li>
            <a href="#about">
              About Us
            </a>
          </li>
          <li>
            <a href="#menu">
              Menu
            </a>
          </li>
          <li>
            <a href="#services">
              Services
            </a>
          </li>
          <li>
            <a href="#testimonials">
              Testimonials
            </a>
          </li>
          <li>
            <a href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div className="md:hidden p-6">
        <div className="flex justify-between">
          <img src={logo} className="w-16" alt="logo" />
          <Button onClick={onToggle}>
            {!isOpen
              ? <HamburgerIcon className="text-3xl" />
              : <CloseIcon className="text-1xl" />
            }
          </Button>
        </div>

        <Collapse in={isOpen} animateOpacity unmountOnExit>
          <ul className="bg-[#3B341Fee] text-[#EFFFC8] absolute left-0 p-6 w-full flex flex-col items-end gap-6 z-10" style={{backdropFilter: 'blur(4px)'}}>
            <li>
              <a href="/">
                Home
              </a>
            </li>
            <li>
              <a href="#about">
                About Us
              </a>
            </li>
            <li>
              <a href="#menu">
                Menu
              </a>
            </li>
            <li>
              <a href="#services">
                Services
              </a>
            </li>
            <li>
              <a href="#testimonials">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </Collapse>
      </div>
      
    </nav>
  )
}

export default Header