import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IStructure } from '../interface/structure';
import { Structure } from '../model/structure';
import { Observable, map } from 'rxjs';
import { TypeStructure } from '../enum/type-structures';


@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IStructure> = this.firestore.collection<IStructure>('structures')

  
/**
 * Créé une structure dans Firestore
 * @param nom Le nom de la structure
   * @returns L'identifiant technique de la structure
 */
  creerStructure(nom: string, type: TypeStructure): Promise<DocumentReference<any>> {

    return this.collection.add({
      nom,
      type
    });
  }

   /**
   * Supprime une structure
   * @param uid l'UID de la structure à supprimer
   * @returns  Le promise résultant de la suppression
   */
   supprimerStructure(uid: string): Promise<void> {
    return this.collection.doc(uid).delete();
  }

  /**
   * Met à jour une structure
   * @param structure l'objet structure à mettre à jour
   * @returns  Le promise résultant de la mise à jour
   */
  mettreAJourStructure(structure: Structure): Promise<void> {

    const istructure: IStructure = {
      nom: structure.nom,
      type: structure.type
    };

    return this.collection.doc(structure.uid).update(istructure).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour de la structure :", error);
    });
  }

   /**
   * Retourne la liste des structures
   * @returns un tableau contenant la liste des saisons
   */
   recupererStructure(): Observable<Structure[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const firestoreData = action.payload.doc.data() as IStructure;
          const uid = action.payload.doc.id;

          // Construction de l'objet IStructure
          const structure: Structure = {
            uid: uid,
            nom: firestoreData.nom,
            type: firestoreData.type
          };

          return structure;
        });
      })
    );
  }

}