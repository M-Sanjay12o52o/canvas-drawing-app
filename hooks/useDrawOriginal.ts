import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint, mode, text }: Draw) => void,
  mode: string
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const [lastMouseClick, setLastMouseClick] = useState<
    { x: number; y: number } | undefined
  >();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const textRef = useRef<string>("");

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const computePointInCanvas = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y };
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      setLastMouseClick(computePointInCanvas(event));
    };

    canvasRef.current?.addEventListener("click", handleClick);

    return () => {
      canvasRef.current?.removeEventListener("click", handleClick);
    };
  }, [computePointInCanvas, setLastMouseClick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentPoint = lastMouseClick;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      if (mode === "text") {
        // Handle text input directly
        if (event.key === "Backspace") {
          textRef.current = textRef.current.slice(0, -1);
        } else if (event.key === "Enter") {
          onDraw({
            ctx,
            currentPoint,
            prevPoint: prevPoint.current,
            text: textRef.current,
            mode,
          });
          textRef.current = ""; // Clear input after rendering
        } else {
          textRef.current += event.key;
          onDraw({
            ctx,
            currentPoint,
            prevPoint: prevPoint.current,
            text: textRef.current,
            mode,
          }); // Draw text on each keypress
        }
      } else if (event.key.length === 1) {
        textRef.current += event.key;
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, onDraw]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      if (mode === "draw") {
        onDraw({
          ctx,
          currentPoint,
          prevPoint: prevPoint.current,
          mode,
          text: "",
        });
        prevPoint.current = currentPoint;
      } else if (mode === "text") {
        onDraw({
          ctx,
          currentPoint,
          prevPoint: prevPoint.current,
          text: textRef.current,
          mode,
        });
        textRef.current = "";
      }
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
