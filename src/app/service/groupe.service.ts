import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IGroupe } from '../interface/groupe';
import { IStructure } from '../interface/structure';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IGroupe> = this.firestore.collection<IGroupe>('groupes')

  recupererGroupesParUidStructure(structureUid: string): Observable<IGroupe[]> {
    // Obtenez la référence de document à partir de l'UID
    const structureRef = this.firestore.doc<IStructure>(`structures/${structureUid}`).ref;

    // Effectuez la requête Firestore avec la référence de document
    return this.recupererGroupesParStructure(structureRef);
  }

  // Méthode générique pour récupérer les groupes par référence de structure
  private recupererGroupesParStructure(structureRef: DocumentReference): Observable<IGroupe[]> {
    return this.firestore.collection<IGroupe>('groupes', ref => 
        ref.where('structure', '==', structureRef)
    ).valueChanges();
  }
}
