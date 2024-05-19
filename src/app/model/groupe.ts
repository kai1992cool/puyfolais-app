export class Groupe {
    uid: string;
    nom: string;
    numero: number;
    structure: string;

    constructor(
        uid: string,
        nom: string,
        numero: number,
        structure: string
      ) {
        this.uid = uid;
        this.nom = nom;
        this.numero = numero;
        this.structure = structure;
      }
} 