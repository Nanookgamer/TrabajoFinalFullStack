/**
 * Punto de entrada de la aplicación Dice Tactics.
 *
 * Monta el componente raíz <Juego> en el elemento #root del DOM.
 * StrictMode activa comprobaciones extra en desarrollo (doble renderizado,
 * detección de efectos secundarios no seguros, APIs obsoletas).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Juego from "./Juego.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Juego />
  </StrictMode>,
);
