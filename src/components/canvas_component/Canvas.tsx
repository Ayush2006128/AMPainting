import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './Canvas.css';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface CanvasProps { color: string }

export interface CanvasHandle {
  save: () => void;
  clear: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ color }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painting, setPainting] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number; } | null>(null);

  // Helper to get accurate pointer position
  const getPointerPos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else if ('clientX' in e) {
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
      };
    }
    return { x: 0, y: 0 };
  };

  const startPaint = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setPainting(true);
    setLastPos(getPointerPos(e));
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
    // Prevent scrolling on touch
    if ('touches' in e) e.preventDefault?.();
    const pos = getPointerPos(e);
    if (lastPos) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setLastPos(pos);
  };

  // Save canvas as image
  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    // Extract base64 from data URL
    const base64 = dataUrl.split(',')[1];

    // Check if running in Capacitor (native) environment
    const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();

    if (isCapacitor) {
      try {
        const fileName = `drawing_${Date.now()}.png`;
        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });
        alert('Image saved to device files.');
      } catch (err) {
        alert('Failed to save image: ' + (err as any).message);
      }
    } else {
      // Browser fallback
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataUrl;
      link.click();
    }
  };

  // Clear canvas
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };


  useImperativeHandle(ref, () => ({ save, clear }), []);

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
});

export default Canvas;
