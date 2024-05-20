import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IGroupe } from '../interface/groupe';
import { Observable, map } from 'rxjs';
import { Groupe } from '../model/groupe';
import { IStructure } from '../interface/structure';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IGroupe> = this.firestore.collection<IGroupe>('groupes')

  /**
 * Créé une groupe dans Firestore
 * @param nom Le nom du groupe
   * @returns L'identifiant technique du groupe
 */
  creerGroupe(nom: string, numero: number, structureUid: string): Promise<DocumentReference<IGroupe>> {

    const structureRef = this.firestore.doc<IStructure>(`structures/${structureUid}`).ref;


    return this.collection.add({
      nom,
      numero,
      structure: structureRef
    });
  }

   /**
   * Supprime un groupe
   * @param uid l'UID du groupe à supprimer
   * @returns  Le promise résultant de la suppression
   */
   supprimerGroupe(uid: string): Promise<void> {
    return this.collection.doc(uid).delete();
  }

  /**
   * Met à jour un groupe
   * @param groupe l'objet groupe à mettre à jour
   * @returns  Le promise résultant de la mise à jour
   */
  mettreAJourGroupe(groupe: Groupe): Promise<void> {

    const igroupe: IGroupe = {
      nom: groupe.nom,
      numero: groupe.numero,
      structure: groupe.structure
    };

    return this.collection.doc(groupe.uid).update(igroupe).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour du groupe :", error);
    });
  }

  recupererGroupesParUidStructure(structureUid: string): Observable<Groupe[]> {
    // Obtenez la référence de document à partir de l'UID
    const structureRef = this.firestore.doc<IStructure>(`structures/${structureUid}`).ref;

    // Effectuez la requête Firestore avec la référence de document
    return this.recupererGroupesParStructure(structureRef);
  }

  private recupererGroupesParStructure(structureRef: DocumentReference): Observable<Groupe[]> {
    return this.firestore.collection<IGroupe>('groupes', ref =>
      ref.where('structure', '==', structureRef)
    ).get().pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const groupe: Groupe = {
            uid: doc.id, // Use the document ID as the uid
            nom: doc.data().nom,
            numero: doc.data().numero,
            structure: doc.data().structure
          };
          return groupe;
        });
      })
    );
  }
}
