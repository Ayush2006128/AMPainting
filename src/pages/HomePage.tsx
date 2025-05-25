import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Canvas from '../components/canvas_component/Canvas';
import ColorPicker from '../components/ui/ColorPicker';
import './HomePage.css';

const DEFAULT_COLOR = '#222';

const HomePage: React.FC = () => {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="canvas-container">
          <Canvas color={color} />
        </div>
        <ColorPicker
          onColorSelect={setColor}
          selectedColor={color}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
