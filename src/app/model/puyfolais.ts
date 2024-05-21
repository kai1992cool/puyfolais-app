import { Foyer } from "./foyer";

export class Puyfolais {
    nom: string;
    prenom: string;
    genre: string;
    numero?: string;
    dateNaissance?: Date;
    numeroTelephone?: string;
    email?: string;
    foyer?: Foyer;

    constructor(
        nom: string,
        prenom: string,
        genre: string,
        numero?: string,
        dateNaissance?: Date,
        numeroTelephone?: string,
        email?: string,
        foyer?: Foyer
    ) {
        this.nom = nom
        this.prenom = prenom
        this.genre = genre
        this.numero = numero
        this.dateNaissance = dateNaissance
        this.numeroTelephone = numeroTelephone
        this.email = email
        this.foyer = foyer
    }
}