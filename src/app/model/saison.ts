import { DocumentReference } from '@angular/fire/compat/firestore';

export interface Saison {
    uid: string;
    libelle?: string;
    dateDebut?: Date;
    dateFin?: Date;
    seances?: DocumentReference[];
}