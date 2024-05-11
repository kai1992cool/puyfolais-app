import { Timestamp } from '@firebase/firestore'; 

export interface ISaison {
    libelle: string;
    dateDebut: Timestamp ;
    dateFin: Timestamp ;
    seances: string[];
}
