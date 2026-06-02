import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'; // 👈 لازم تكون هنا
import App from "./app/App.tsx";
import "./styles/index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>  {/* 👈 دي اللي بتشغل الروابط */}
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);