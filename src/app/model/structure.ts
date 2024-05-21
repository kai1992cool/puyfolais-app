import { TypeStructure } from "../enum/type-structures";

export class Structure {
    uid: string;
    nom?: string;
    type?: TypeStructure;

    constructor(
        uid: string,
        nom?: string,
        type?: TypeStructure
      ) {
        this.uid = uid;
        this.nom = nom;
        this.type = type
      }
} 