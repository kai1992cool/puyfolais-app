import { Timestamp } from "firebase/firestore";

export interface IPuyfolais {
    numero: string;
    nom: string;
    prenom: string;
    dateNaissance: Timestamp;
    numeroTelephone: string;
    email: string;
}