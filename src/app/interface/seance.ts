import { Timestamp } from '@firebase/firestore'; 
import { TypeSeance } from '../enum/type-seances';

export interface ISeance {
    date: Timestamp;
    type: TypeSeance;
}
