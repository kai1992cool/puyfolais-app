import { Timestamp } from '@firebase/firestore'; 

export interface ISaison {
    uid: string;
    libelle: string;
    dateDebut: Timestamp ;
    dateFin: Timestamp ;
    seances: string[];
}
