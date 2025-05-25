import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

interface ClearFabProps {
  onClear: () => void;
}

const ClearFab: React.FC<ClearFabProps> = ({ onClear }) => (
  <IonFab vertical="bottom" horizontal="start" slot="fixed">
    <IonFabButton color="danger" onClick={onClear} title="Clear Canvas">
      <IonIcon icon={trash} />
    </IonFabButton>
  </IonFab>
);

export default ClearFab;
