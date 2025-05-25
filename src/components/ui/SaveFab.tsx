import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { download } from 'ionicons/icons';
import './SaveFab.css';

interface SaveFabProps {
  onSave: () => void;
}

const SaveFab: React.FC<SaveFabProps> = ({ onSave }) => (
  <IonFabButton color="primary" onClick={onSave} title="Save Drawing">
    <IonIcon icon={download} />
  </IonFabButton>
);

export default SaveFab;
