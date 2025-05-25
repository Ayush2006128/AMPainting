import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import './ClearFab.css';

interface ClearFabProps {
  onClear: () => void;
}

const ClearFab: React.FC<ClearFabProps> = ({ onClear }) => (
  <IonFabButton color="danger" onClick={onClear} title="Clear Canvas">
    <IonIcon icon={trash} />
  </IonFabButton>
);

export default ClearFab;
