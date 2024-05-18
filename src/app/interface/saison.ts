import { Timestamp } from '@firebase/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';

export interface ISaison {
    libelle: string;
    dateDebut: Timestamp;
    dateFin: Timestamp;
    seances: DocumentReference[];
}