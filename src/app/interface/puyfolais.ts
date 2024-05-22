import { Timestamp } from "firebase/firestore";

export interface IPuyfolais {
    numero: number;
    nom: string;
    prenom: string;
    genre: string;
    dateNaissance?: Timestamp;
    numeroTelephone?: string;
    email?: string;
}