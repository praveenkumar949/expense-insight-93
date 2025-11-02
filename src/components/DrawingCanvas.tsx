import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Pencil, Eraser, Download, Trash2, Palette } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  initialDrawing?: string;
}

const DrawingCanvas = ({ onSave, initialDrawing }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    setCtx(context);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    } else {
      // Set white background
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialDrawing]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 3 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    setIsDrawing(false);
    ctx.closePath();
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  const downloadDrawing = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={tool === "pen" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("pen")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={tool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("eraser")}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        {tool === "pen" && (
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-6 w-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: c, borderColor: color === c ? "#000" : "transparent" }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-1 items-center gap-2">
          <Label className="text-sm">Size:</Label>
          <Slider
            value={[lineWidth]}
            onValueChange={(value) => setLineWidth(value[0])}
            min={1}
            max={20}
            step={1}
            className="w-32"
          />
          <span className="text-sm">{lineWidth}px</span>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadDrawing}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ touchAction: "none" }}
      />

      <Button type="button" onClick={handleSave} className="w-full">
        Save Drawing
      </Button>
    </div>
  );
};

export default DrawingCanvas;
