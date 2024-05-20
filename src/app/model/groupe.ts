import { DocumentReference } from "@angular/fire/compat/firestore";

export class Groupe {
    uid: string;
    nom?: string;
    numero?: number;
    structure?: DocumentReference;

    constructor(
        uid: string,
        nom: string,
        numero: number,
        structure: DocumentReference
      ) {
        this.uid = uid;
        this.nom = nom;
        this.numero = numero;
        this.structure = structure;
      }
} 