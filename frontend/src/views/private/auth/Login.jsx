import { useState } from "react"
import { api } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.auth.login({
        email,
        password
      });

      if (response.status === "success") {
        // Guardamos el token en sessionStorage
        sessionStorage.setItem("token", response.data.token);
        
        navigate("/admin/dashboard");
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  return (
    <main className="flex-grow flex container mx-auto">
      <form
        className="m-auto grid gap-6 p-6 border border-[#85CB33] rounded-xl shadow-xl shadow-[#85CB33]"
        onSubmit={handleLogin}
      >
        <input
          className="p-3 rounded-xl"
          type="Email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-3 rounded-xl"
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          className="p-3 grid justify-center rounded-xl bg-[#ffffff42] hover:bg-[#EFFFC8] text-[#85CB33] hover:text-[#100B00] font-bold"
          type="submit"
        >
          Iniciar sesión
        </button>
      </form>
    </main>
  )
}

export default Login