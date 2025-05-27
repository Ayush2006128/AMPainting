import React, { useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import { menu } from 'ionicons/icons';
import Canvas, { CanvasHandle } from '../components/canvas_component/Canvas';
import ColorPicker from '../components/ui/ColorPicker';
import './HomePage.css';
import SaveFab from '../components/ui/SaveFab';
import ClearFab from '../components/ui/ClearFab';

const DEFAULT_COLOR = '#222';
const DEFAULT_STROKE_WIDTH = 3;

const HomePage: React.FC = () => {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(DEFAULT_STROKE_WIDTH);
  const canvasRef = useRef<CanvasHandle>(null);
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="canvas-container">
          <Canvas color={color} strokeWidth={strokeWidth} ref={canvasRef} />
        </div>
        <div className="controls">
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="primary">
              <IonIcon icon={menu} />
            </IonFabButton>
            <IonFabList side="top">
              <ColorPicker
                onColorSelect={setColor}
                selectedColor={color}
                strokeWidth={strokeWidth}
                onStrokeWidthChange={setStrokeWidth}
              />
              <SaveFab onSave={() => {
                canvasRef.current?.save();
              }} />
              <ClearFab onClear={() => {
                canvasRef.current?.clear();
              }} />
            </IonFabList>
          </IonFab>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
