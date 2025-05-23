import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Canvas from '../components/canvas_component/Canvas';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Canvas />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
