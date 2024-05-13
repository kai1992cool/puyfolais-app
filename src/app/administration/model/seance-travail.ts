import { ISeance } from "../../interface/seance";

export class SeanceTravail {
    date: Date;
    seance?: ISeance;
    selectionne = false;
  
    constructor(date: Date) {
      this.date = date;
    }
    
}