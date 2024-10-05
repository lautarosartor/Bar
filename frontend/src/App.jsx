import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./views/public/Home"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Services from "./views/public/Services"
import About from "./views/public/About"
import Testimonials from "./views/public/Testimonials"
import NotFound from "./components/NotFound"
import Menu from "./views/public/Menu"
import { ChakraProvider } from "@chakra-ui/react"
import Contact from "./views/public/Contact"

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Header />
        <main className="flex-grow container mx-auto my-20 space-y-20 md:my-32 md:space-y-32 px-6 md:px-10 xl:px-28">
          <Routes>
            <Route exact path="/"
              element={
                <>
                  <Home />
                  <About />
                  <Menu />
                  <Services />
                  <Testimonials />
                  <Contact />
                </>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
