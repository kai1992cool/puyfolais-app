import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IPuyfolais } from '../interface/puyfolais';
import { Puyfolais } from '../model/puyfolais';
import { Timestamp } from 'firebase/firestore';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuyfolaisService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IPuyfolais> = this.firestore.collection<IPuyfolais>('puyfolais')

  /**
 * Créé une puyfolais dans Firestore
 * @param nom Le puyfolais
   * @returns L'identifiant technique du puyfolais
 */
  creerPuyfolais(puyfolais: FormGroup): Promise<DocumentReference<IPuyfolais>> {

    const ipuyfolais: IPuyfolais = {
      numero: puyfolais.value.numero,
      nom: puyfolais.value.nom,
      prenom: puyfolais.value.prenom,
      genre: puyfolais.value.genre
    };

    if (puyfolais.value.dateNaissance) {
      ipuyfolais.dateNaissance = Timestamp.fromDate(puyfolais.value.dateNaissance);
    }

    if (puyfolais.value.numeroTelephone) {
      ipuyfolais.numeroTelephone = puyfolais.value.numeroTelephone;
    }

    if (puyfolais.value.email) {
      ipuyfolais.email = puyfolais.value.email;
    }

    return this.collection.add(ipuyfolais);
  }

  /**
  * Supprime un puyfolais
  * @param uid l'UID du puyfolais à supprimer
  * @returns  Le promise résultant de la suppression
  */
  supprimerPuyfolais(uid: string): Promise<void> {
    return this.collection.doc(uid).delete();
  }

  /**
   * Met à jour un puyfolais
   * @param groupe l'objet puyfolais à mettre à jour
   * @returns  Le promise résultant de la mise à jour
   */
  mettreAJourPuyfolais(puyfolais: Puyfolais): Promise<void> {

    let dateNaissance: Timestamp | undefined;
    if (puyfolais.dateNaissance) {
      dateNaissance = Timestamp.fromDate(puyfolais.dateNaissance);
    } else {
      dateNaissance = undefined;
    };

    const igroupe: IPuyfolais = {
      numero: puyfolais.numero,
      nom: puyfolais.nom,
      prenom: puyfolais.prenom,
      genre: puyfolais.genre,
      dateNaissance: dateNaissance,
      numeroTelephone: puyfolais.numeroTelephone,
      email: puyfolais.email
    };

    return this.collection.doc(puyfolais.uid).update(igroupe).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour du puyfolais :", error);
    });
  }

  /**
  * Retourne la liste des structures
  * @returns un tableau contenant la liste des saisons
  */
  recupererPuyfolais(): Observable<Puyfolais[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const firestoreData = action.payload.doc.data() as IPuyfolais;
          const uid = action.payload.doc.id;

          // Construction de l'objet Puyfolais
          let puyfolais: Puyfolais = {
            uid: uid,
            numero: firestoreData.numero,
            nom: firestoreData.nom,
            prenom: firestoreData.prenom,
            genre: firestoreData.genre
          };

          if (firestoreData.dateNaissance) {
            puyfolais.dateNaissance = firestoreData.dateNaissance.toDate()
          }

          if (firestoreData.email) {
            puyfolais.email = firestoreData.email
          }

          if (firestoreData.numeroTelephone) {
            puyfolais.numeroTelephone = firestoreData.numeroTelephone
          }
          return puyfolais;
        });
      })
    );
  }
}
