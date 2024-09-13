import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./views/public/Home"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Services from "./views/public/Services"
import About from "./views/public/About"
import Testimonials from "./views/public/Testimonials"

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact path="/"
          element={
            <>
              <Home />
              <Services />
              <About />
              <Testimonials />
            </>
          }
        />
        <Route path="*" element={<p>Not Found...</p>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
