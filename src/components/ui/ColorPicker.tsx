import React, { useState, useRef, useEffect } from 'react';
import { IonFab, IonFabButton, IonIcon, IonModal, IonContent } from '@ionic/react';
import { colorPalette } from 'ionicons/icons';
import './ColorPicker.css';

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, selectedColor }) => {
  const [showModal, setShowModal] = useState(false);
  const [pickerColor, setPickerColor] = useState(selectedColor);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (showModal && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Draw horizontal hue gradient
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
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
  }, [showModal]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    setPickerColor(color);
    onColorSelect(color);
    setShowModal(false);
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowModal(true)} color="primary">
          <IonIcon icon={colorPalette} />
        </IonFabButton>
      </IonFab>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent className="color-picker-modal">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
            <canvas
              ref={canvasRef}
              width={260}
              height={180}
              style={{ borderRadius: 12, cursor: 'crosshair', boxShadow: '0 2px 8px #0002' }}
              onClick={handleCanvasClick}
            />
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: pickerColor, border: '2px solid #222', display: 'inline-block' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 14 }}>{pickerColor}</span>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ColorPicker;
