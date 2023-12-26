"use client";

import { FC, useState } from "react";
import { useDraw } from "../hooks/useDrawOriginal";
import { ChromePicker } from "react-color";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const [mode, setMode] = useState<string>("");

  console.log("mode: ", mode);

  const { canvasRef, onMouseDown, clear } = useDraw(drawLine, mode);

  function drawLine({ prevPoint, currentPoint, ctx, text }: Draw) {
    if (mode === "draw") {
      console.log("control reached: if draw");
      const { x: currX, y: currY } = currentPoint || { x: 0, y: 0 };
      const lineColor = color;
      const lineWidth = 5;

      let startPoint = prevPoint ?? currentPoint;
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(startPoint!.x, startPoint!.y);
      ctx.lineTo(currX, currY);
      ctx.stroke();

      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(startPoint!.x, startPoint!.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    } else if (mode === "text") {
      console.log("control reached if text");
      ctx.font = "48px serif";
      ctx.fillStyle = "black";

      // Use currentPoint from the Draw object (which now holds lastMouseClick)
      ctx.fillText(text, currentPoint!.x, currentPoint!.y);
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black"
          onClick={clear}
        >
          Clear canvas
        </button>
        <button
          type="button"
          className="p-2 bg-slate-400 rounded-md border border-black"
          onClick={() => setMode("text")}
        >
          Text Mode
        </button>
        <button
          type="button"
          className="p-2 bg-slate-600 rounded-md border border-black"
          onClick={() => setMode("draw")}
        >
          Draw Mode
        </button>
      </div>
      <canvas
        tabIndex={0}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  );
};

export default page;
