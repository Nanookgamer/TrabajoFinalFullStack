/**
 * Hook que dibuja el efecto de lluvia de Matrix en un elemento <canvas>.
 *
 * Usa la Canvas 2D API con requestAnimationFrame para animar columnas
 * de caracteres (katakana + símbolos) que caen de arriba a abajo.
 * El fondo semi-transparente crea el efecto de estela caracterísico del Matrix.
 *
 * Se limpia automáticamente al desmontar el componente (cancelAnimationFrame
 * y removeEventListener) y se redimensiona cuando cambia el tamaño de ventana.
 */
import { useEffect, type RefObject } from 'react';

export function useMatrixRain(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Caracteres usados en la animación: katakana + símbolos de terminal
    const chars = 'アイウエカキクサシスタチツナニ#$%&ABCDEF><123456';

    // Ajusta el canvas al tamaño real de la ventana
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const fontSize = 14;
    let cols  = Math.floor(canvas.width / fontSize);
    // Cada columna mantiene su propio cursor de posición vertical
    let drops: number[] = Array(cols).fill(1);

    let animId: number;

    function draw() {
      // Capa semi-transparente que crea la estela de los caracteres al bajar
      ctx!.fillStyle = 'rgba(5,5,16,0.05)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Color y fuente de los caracteres
      ctx!.fillStyle = 'rgba(0,255,204,0.15)';
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Elige un carácter aleatorio de la cadena de caracteres
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillText(ch, i * fontSize, drops[i] * fontSize);

        // Reinicia la columna al llegar al borde inferior (probabilidad aleatoria)
        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    // Recalcula columnas al redimensionar la ventana
    const onResize = () => {
      resize();
      cols  = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    window.addEventListener('resize', onResize);

    // Limpieza al desmontar: cancela la animación y el listener
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [canvasRef]);
}
