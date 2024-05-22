export class Puyfolais {
    uid: string;
    nom: string;
    prenom: string;
    genre: string;
    numero: number;
    dateNaissance?: Date;
    numeroTelephone?: string;
    email?: string;
    adresse?: string;
    cp?: string;
    ville?: string;

    constructor(
        uid: string,
        nom: string,
        prenom: string,
        genre: string,
        numero: number,
        dateNaissance?: Date,
        numeroTelephone?: string,
        email?: string,
        adresse?: string,
        cp?: string,
        ville?: string
    ) {
        this.uid = uid
        this.nom = nom
        this.prenom = prenom
        this.genre = genre
        this.numero = numero
        this.dateNaissance = dateNaissance
        this.numeroTelephone = numeroTelephone
        this.email = email
        this.adresse = adresse
        this.cp = cp
        this.ville = ville
    }


}