import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './Canvas.css';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface CanvasProps { color: string; strokeWidth: number }

export interface CanvasHandle {
  save: () => void;
  clear: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ color, strokeWidth }, ref) => {
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
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setLastPos(pos);
  };

  // Save canvas as image (with haptic feedback)
  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Haptic feedback (if available)
    if ((window as any).navigator?.vibrate) {
      (window as any).navigator.vibrate(50);
    } else if ((window as any).Capacitor?.Haptics) {
      (window as any).Capacitor.Haptics.impact({ style: 'medium' });
    }

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
        // Show toast on successful save (Capacitor Toast plugin)
        if ((window as any).Capacitor?.Plugins?.Toast) {
          (window as any).Capacitor.Plugins.Toast.show({
            text: 'Image saved to device files.',
            duration: 'short',
          });
        } else {
          alert('Image saved to device files.');
        }
      } catch (err) {
        alert('Failed to save image: ' + (err as any).message);
      }
    } else {
      // Browser fallback
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataUrl;
      link.click();
      // Show toast for browser
      if ((window as any).Capacitor?.Plugins?.Toast) {
        (window as any).Capacitor.Plugins.Toast.show({
          text: 'Image saved to device files.',
          duration: 'short',
        });
      } else if ((window as any).toast) {
        (window as any).toast('Image saved to device files.');
      } else {
        alert('Image saved to device files.');
      }
    }
  };

  // Clear canvas with gradient animation and haptic feedback
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Haptic feedback (if available)
    if ((window as any).navigator?.vibrate) {
      (window as any).navigator.vibrate(50);
    } else if ((window as any).Capacitor?.Haptics) {
      (window as any).Capacitor.Haptics.impact({ style: 'medium' });
    }

    // Animation parameters
    const duration = 600; // ms
    const steps = 30;
    let currentStep = 0;

    const animate = () => {
      const progress = currentStep / steps;
      // Create a vertical gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `rgba(255,80,80,${progress})`); // More reddish at the top
      gradient.addColorStop(1, `rgba(255,0,0,${progress})`);   // Strong red at the bottom
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      currentStep++;
      if (currentStep <= steps) {
        requestAnimationFrame(animate);
      } else {
        // Actually clear the canvas after animation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
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
