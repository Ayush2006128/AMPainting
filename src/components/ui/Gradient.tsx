import React, { useRef, useEffect } from 'react';
import './Gradient.css';

interface GradientColorPickerProps {
  previewColor: string;
  setPreviewColor: (color: string) => void;
}

const GradientColorPicker: React.FC<GradientColorPickerProps> = ({ previewColor, setPreviewColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        // Draw horizontal hue gradient
        const hueGradient = ctx.createLinearGradient(0, 0, width, 0);
        for (let i = 0; i <= 360; i += 10) {
          hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }
        ctx.fillStyle = hueGradient;
        ctx.fillRect(0, 0, width, height);
        // Draw vertical white-black gradient
        const whiteBlackGradient = ctx.createLinearGradient(0, 0, 0, height);
        whiteBlackGradient.addColorStop(0, 'rgba(255,255,255,1)');
        whiteBlackGradient.addColorStop(0.5, 'rgba(255,255,255,0)');
        whiteBlackGradient.addColorStop(0.5, 'rgba(0,0,0,0)');
        whiteBlackGradient.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = whiteBlackGradient;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    setPreviewColor(color);
  };

  return (
    <canvas
      ref={canvasRef}
      className="gradient-canvas"
      onClick={handleCanvasClick}
    />
  );
};

export default GradientColorPicker;
