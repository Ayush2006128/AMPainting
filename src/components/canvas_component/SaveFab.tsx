import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { download } from 'ionicons/icons';

interface SaveFabProps {
  onSave: () => void;
}

const SaveFab: React.FC<SaveFabProps> = ({ onSave }) => (
  <IonFab vertical="bottom" horizontal="center" slot="fixed">
    <IonFabButton color="primary" onClick={onSave} title="Save Drawing">
      <IonIcon icon={download} />
    </IonFabButton>
  </IonFab>
);

export default SaveFab;
