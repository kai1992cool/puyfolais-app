import { EtatSeance } from '../enum/etat-seances';

export class Seance {
    uid: string;
    date: Date;
    type: EtatSeance;
    supprimee: boolean ;
    miseAJour: boolean;

    constructor(
        uid: string,
        date: Date,
        type: EtatSeance,
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