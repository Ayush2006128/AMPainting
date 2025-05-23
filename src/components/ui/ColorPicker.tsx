import React, { useState } from 'react';
import { IonFab, IonFabButton, IonIcon, IonModal, IonContent } from '@ionic/react';
import { colorPalette } from 'ionicons/icons';
import './ColorPicker.css';

const COLORS = [
  '#222', '#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#fff', '#000'
];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, selectedColor }) => {
  const [showModal, setShowModal] = useState(false);

  const handleColorClick = (color: string) => {
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
          <div className="color-picker-grid">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`color-swatch${selectedColor === color ? ' selected' : ''}`}
                style={{ background: color }}
                onClick={() => handleColorClick(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ColorPicker;
