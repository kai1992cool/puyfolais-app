import { Timestamp } from '@firebase/firestore'; 
import { EtatSeance } from '../enum/etat-seances';

export interface ISeance {
    uid: string;
    date: Timestamp;
    type: EtatSeance;
}
