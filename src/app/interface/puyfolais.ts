import { Timestamp } from "firebase/firestore";
import { IFoyer } from "./foyer";

export interface IPuyfolais {
    numero: string;
    nom: string;
    prenom: string;
    dateNaissance: Timestamp;
    numeroTelephone: string;
    email: string;
    foyer: IFoyer;
}