import { DocumentReference } from '@angular/fire/compat/firestore';

export class Saison {
    uid: string;
    libelle?: string;
    dateDebut?: Date;
    dateFin?: Date;
    seances?: DocumentReference[];

    constructor(
        uid: string,
        libelle?: string,
        dateDebut?: Date,
        dateFin?: Date,
        seances?: DocumentReference[]
      ) {
        this.uid = uid;
        this.libelle = libelle;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.seances = seances;
      }
}