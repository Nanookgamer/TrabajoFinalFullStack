/**
 * Fondo que dibuja el efecto de lluvia de código estilo Matrix sobre un <canvas>.
 *
 * Usa requestAnimationFrame para animar columnas de caracteres que caen.
 * Cada frame se pinta un rectángulo semitransparente sobre el canvas para
 * crear el efecto de estela (fade-out de los caracteres anteriores).
 *
 * Cancela la animación y el listener de resize al desmontar el componente.
 */
import { useEffect, type RefObject } from "react";

export function useMatrixRain(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mezcla de caracteres especiales para dar el efecto de Matrix
    const chars = "アイウエカキクサシスタチツナニ#$%&ABCDEF><123456";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(cols).fill(1);

    let animId: number;

    function draw() {
      ctx!.fillStyle = "rgba(5,5,16,0.05)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "rgba(0,255,204,0.15)";
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      resize();
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
}
