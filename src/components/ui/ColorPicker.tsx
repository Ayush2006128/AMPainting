import React, { useState, useEffect } from 'react';
import { IonFabButton, IonIcon, IonModal, IonContent } from '@ionic/react';
import { colorPalette } from 'ionicons/icons';
import './ColorPicker.css';
import GradientColorPicker from './Gradient';

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorSelect,
  selectedColor,
  strokeWidth,
  onStrokeWidthChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [pickerColor, setPickerColor] = useState(selectedColor);
  const [tempStrokeWidth, setTempStrokeWidth] = useState(strokeWidth);

  useEffect(() => {
    if (showModal) {
      setPickerColor(selectedColor);
      setTempStrokeWidth(strokeWidth);
    }
  }, [showModal, selectedColor, strokeWidth]);

  const handleCancel = () => {
    setShowModal(false);
    setPickerColor(selectedColor);
    setTempStrokeWidth(strokeWidth);
  };

  const handleSubmit = () => {
    onColorSelect(pickerColor);
    onStrokeWidthChange(tempStrokeWidth);
    setShowModal(false);
  };

  return (
    <>
      <IonFabButton onClick={() => setShowModal(true)} color="secondary">
        <IonIcon icon={colorPalette} />
      </IonFabButton>
      <IonModal isOpen={showModal} onDidDismiss={handleCancel}>
        <IonContent className="color-picker-modal">
          <div className="color-picker-modal-content">
            <h2 className="color-picker-title">Brush Settings</h2>
            <GradientColorPicker previewColor={pickerColor} setPreviewColor={setPickerColor} />
            <div className="color-picker-preview-row">
              <span
                className="color-picker-preview-swatch"
                style={{ background: pickerColor }}
              />
              <span className="color-picker-preview-code">{pickerColor}</span>
            </div>
            <div className="color-picker-slider-row">
              <label htmlFor="stroke-width-slider" className="color-picker-slider-label">
                Stroke Width
              </label>
              <input
                id="stroke-width-slider"
                type="range"
                min={1}
                max={30}
                value={tempStrokeWidth}
                onChange={e => setTempStrokeWidth(Number(e.target.value))}
                className="color-picker-slider"
              />
              <span className="color-picker-slider-value">
                <svg width="32" height="32">
                  <circle
                    cx="16"
                    cy="16"
                    r={tempStrokeWidth / 2}
                    fill={pickerColor}
                    stroke="#222"
                    strokeWidth="1"
                  />
                </svg>
                <span style={{ marginLeft: 8 }}>{tempStrokeWidth}px</span>
              </span>
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
