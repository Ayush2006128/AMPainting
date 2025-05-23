import React, { useRef, useState } from 'react';
import './Canvas.css';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painting, setPainting] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startPaint = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setPainting(true);
    setLastPos(getPos(e));
  };

  const endPaint = () => {
    setPainting(false);
    setLastPos(null);
  };

  const paint = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!painting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    if (lastPos) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setLastPos(pos);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.6}
        className="painting-canvas"
        onMouseDown={startPaint}
        onMouseUp={endPaint}
        onMouseOut={endPaint}
        onMouseMove={paint}
        onTouchStart={startPaint}
        onTouchEnd={endPaint}
        onTouchCancel={endPaint}
        onTouchMove={paint}
      />
    </div>
  );
};

export default Canvas;
