import React, { useState, useEffect } from 'react';
import { IonFab, IonFabButton, IonIcon, IonModal, IonContent } from '@ionic/react';
import { colorPalette } from 'ionicons/icons';
import './ColorPicker.css';
import GradientColorPicker from './Gradient';

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, selectedColor }) => {
  const [showModal, setShowModal] = useState(false);
  const [pickerColor, setPickerColor] = useState(selectedColor);

  useEffect(() => {
    if (showModal) setPickerColor(selectedColor);
  }, [showModal, selectedColor]);

  const handleCancel = () => {
    setShowModal(false);
    setPickerColor(selectedColor); // Reset preview
  };

  const handleSubmit = () => {
    onColorSelect(pickerColor);
    setShowModal(false);
  };

  return (
    <>
      <IonFabButton onClick={() => setShowModal(true)} color="primary">
        <IonIcon icon={colorPalette} />
      </IonFabButton>
      <IonModal isOpen={showModal} onDidDismiss={handleCancel}>
        <IonContent className="color-picker-modal">
          <div className="color-picker-modal-content">
            <GradientColorPicker previewColor={pickerColor} setPreviewColor={setPickerColor} />
            <div className="color-picker-preview-row">
              <span
                className="color-picker-preview-swatch"
                style={{ background: pickerColor }}
              />
              <span className="color-picker-preview-code">{pickerColor}</span>
            </div>
            <div className="color-picker-actions">
              <button onClick={handleCancel} className="color-picker-btn-cancel">Cancel</button>
              <button onClick={handleSubmit} className="color-picker-btn-submit">Select</button>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ColorPicker;
