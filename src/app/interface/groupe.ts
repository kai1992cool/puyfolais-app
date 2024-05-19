import { DocumentReference } from "@angular/fire/compat/firestore";

export interface IGroupe {
    nom: string;
    numero: number;
    structure: DocumentReference;
}
