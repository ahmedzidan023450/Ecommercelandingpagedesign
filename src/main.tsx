import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { CartProvider } from "./context/CartContext"; // السطر الجديد هنا

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <App />
  </CartProvider>
);