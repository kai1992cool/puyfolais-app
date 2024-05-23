import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IPuyfolais } from '../interface/puyfolais';
import { Puyfolais } from '../model/puyfolais';
import { Timestamp } from 'firebase/firestore';
import { FormGroup } from '@angular/forms';
import { Observable, from } from 'rxjs';

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
  creerPuyfolais(formPuyfolais: FormGroup): Promise<DocumentReference<IPuyfolais>> {

    const ipuyfolais: IPuyfolais = {
      numero: formPuyfolais.value.numero,
      nom: formPuyfolais.value.nom.toLowerCase(),
      prenom: formPuyfolais.value.prenom.toLowerCase(),
      genre: formPuyfolais.value.genre
    };

    if (formPuyfolais.value.dateNaissance) {
      ipuyfolais.dateNaissance = Timestamp.fromDate(formPuyfolais.value.dateNaissance);
    }

    if (formPuyfolais.value.numeroTelephone) {
      ipuyfolais.numeroTelephone = formPuyfolais.value.tel;
    }

    if (formPuyfolais.value.email) {
      ipuyfolais.email = formPuyfolais.value.email.toLowerCase();
    }

    if (formPuyfolais.value.adresse) {
      ipuyfolais.adresse = formPuyfolais.value.adresse.toLowerCase();
    }

    if (formPuyfolais.value.cp) {
      ipuyfolais.cp = formPuyfolais.value.cp;
    }

    if (formPuyfolais.value.ville) {
      ipuyfolais.ville = formPuyfolais.value.ville.toLowerCase();
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

    const ipuyfolais: IPuyfolais = {
      numero: puyfolais.numero,
      nom: puyfolais.nom.toLowerCase(),
      prenom: puyfolais.prenom.toLowerCase(),
      genre: puyfolais.genre,
    };

    if (puyfolais.dateNaissance) {
      ipuyfolais.dateNaissance = Timestamp.fromDate(puyfolais.dateNaissance);
    }

    if (puyfolais.numeroTelephone) {
      ipuyfolais.numeroTelephone = puyfolais.numeroTelephone;
    }

    if (puyfolais.email) {
      ipuyfolais.email = puyfolais.email.toLowerCase();
    }

    if (puyfolais.adresse) {
      ipuyfolais.adresse = puyfolais.adresse.toLowerCase();
    }

    if (puyfolais.cp) {
      ipuyfolais.cp = puyfolais.cp;
    }

    if (puyfolais.ville) {
      ipuyfolais.ville = puyfolais.ville.toLowerCase();
    }

    return this.collection.doc(puyfolais.uid).update(ipuyfolais).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour du puyfolais :", error);
    });
  }

  /**
  * Retourne la liste des structures
  * @returns un tableau contenant la liste des saisons
  */
  recupererPuyfolais(filtre: string): Observable<Puyfolais[]> {
    return from(this.collection.ref.where('nom', '>=', filtre)
      .where('nom', '<=', filtre + '\uf8ff')
      // .where('prenom', '>=', filtre)
      // .where('prenom', '<=', filtre + '\uf8ff')
      // .where('email', '>=', filtre)
      // .where('email', '<=', filtre + '\uf8ff')
      // .where('numero', '==', parseInt(filtre))
      // .where('adresse', '>=', filtre)
      // .where('adresse', '<=', filtre + '\uf8ff')
      // .where('ville', '>=', filtre)
      // .where('ville', '<=', filtre + '\uf8ff')
      // .where('cp', '>=', filtre)
      // .where('cp', '<=', filtre + '\uf8ff')
      .limit(10)
      .get()
      .then(snapshot => {
        const puyfolaisList: Puyfolais[] = [];
        snapshot.docs.forEach(doc => {
          const firestoreData = doc.data() as IPuyfolais;
          const uid = doc.id;

          // Construction de l'objet Puyfolais
          let puyfolais: Puyfolais = {
            uid: uid,
            numero: firestoreData.numero,
            nom: firestoreData.nom,
            prenom: firestoreData.prenom,
            genre: firestoreData.genre
          };

          if (firestoreData.dateNaissance) {
            puyfolais.dateNaissance = firestoreData.dateNaissance.toDate();
          }

          if (firestoreData.email) {
            puyfolais.email = firestoreData.email;
          }

          if (firestoreData.numeroTelephone) {
            puyfolais.numeroTelephone = firestoreData.numeroTelephone;
          }

          if (firestoreData.adresse) {
            puyfolais.adresse = firestoreData.adresse;
          }

          if (firestoreData.cp) {
            puyfolais.cp = firestoreData.cp;
          }

          if (firestoreData.ville) {
            puyfolais.ville = firestoreData.ville;
          }

          puyfolaisList.push(puyfolais);
        });
        return puyfolaisList;
      }));
  }
}
