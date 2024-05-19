import { TypeSeance } from '../enum/type-seances';

export class Seance {
    uid: string;
    date: Date;
    type: TypeSeance;
    supprimee: boolean ;
    miseAJour: boolean;

    constructor(
        uid: string,
        date: Date,
        type: TypeSeance,
      ) {
        this.uid = uid;
        this.date = date;
        this.type = type;
        this.supprimee = false;
        this.miseAJour = false;
      }

      seanceADate(date: Date): boolean {
        return this.date.getTime() === date.getTime();
      }

} 