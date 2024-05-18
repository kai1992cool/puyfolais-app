import { Timestamp } from '@firebase/firestore'; 
import { EtatSeance } from '../enum/etat-seances';

export interface ISeance {
    date: Timestamp;
    type: EtatSeance;
}
