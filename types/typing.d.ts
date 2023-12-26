type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point | undefined;
  prevPoint: Point | null;
  mode: string;
  text: string;
};

type Point = { x: number; y: number };
