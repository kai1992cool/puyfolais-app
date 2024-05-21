

export class Foyer {
    adresse: string;
    complement: string;
    codePostal: string;
    ville: string;

    constructor(
        adresse: string,
        complement: string,
        codePostal: string,
        ville: string
    ) {
        this.adresse = adresse
        this.complement = complement
        this.codePostal = codePostal
        this.ville = ville
    }
}