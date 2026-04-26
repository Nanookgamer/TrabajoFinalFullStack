/**
 * Punto de entrada de siempre en react, lo he dejado como estaba (quitando el css y los import innecesarios)
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Juego from "./Juego.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Juego />
  </StrictMode>,
);
