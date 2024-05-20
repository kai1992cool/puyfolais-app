import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IGroupe } from '../interface/groupe';
import { IStructure } from '../interface/structure';
import { Observable, map } from 'rxjs';
import { Groupe } from '../model/groupe';
@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IGroupe> = this.firestore.collection<IGroupe>('groupes')

  recupererGroupesParUidStructure(structureUid: string): Observable<Groupe[]> {
    // Obtenez la référence de document à partir de l'UID
    const structureRef = this.firestore.doc<IStructure>(`structures/${structureUid}`).ref;

    // Effectuez la requête Firestore avec la référence de document
    return this.recupererGroupesParStructure(structureRef);
  }

  private recupererGroupesParStructure(structureRef: DocumentReference): Observable<Groupe[]> {
    return this.firestore.collection<IGroupe>('igroupes', ref =>
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
