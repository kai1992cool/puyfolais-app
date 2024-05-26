import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IPuyfolais } from '../interface/puyfolais';
import { Puyfolais } from '../model/puyfolais';
import { Timestamp, getFirestore, or, query, where, collection, getDocs, limit, and } from 'firebase/firestore';
import { FormGroup } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PuyfolaisService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IPuyfolais> = this.firestore.collection<IPuyfolais>('puyfolais')
  puyfolaisRef = collection(getFirestore(), "puyfolais");

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

    if (formPuyfolais.value.tel) {
      ipuyfolais.numeroTelephone = formPuyfolais.value.tel;
    }

    if (formPuyfolais.value.email) {
      ipuyfolais.email = formPuyfolais.value.email.toLowerCase();
    }

    if (formPuyfolais.value.adresse) {
      ipuyfolais.adresse = formPuyfolais.value.adresse;
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
  mettreAJourPuyfolais(formPuyfolais: FormGroup, uid: string): Promise<void> {

    const ipuyfolais: IPuyfolais = {
      numero: formPuyfolais.value.numero,
      nom: formPuyfolais.value.nom.toLowerCase(),
      prenom: formPuyfolais.value.prenom.toLowerCase(),
      genre: formPuyfolais.value.genre,
    };

    if (formPuyfolais.value.dateNaissance) {
      ipuyfolais.dateNaissance = Timestamp.fromDate(formPuyfolais.value.dateNaissance);
    }

    if (formPuyfolais.value.tel) {
      ipuyfolais.numeroTelephone = formPuyfolais.value.tel;
    }

    if (formPuyfolais.value.email) {
      ipuyfolais.email = formPuyfolais.value.email.toLowerCase();
    }

    if (formPuyfolais.value.adresse) {
      ipuyfolais.adresse = formPuyfolais.value.adresse;
    }

    return this.collection.doc(uid).update(ipuyfolais).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour du puyfolais :", error);
    });
  }

  /**
  * Retourne la liste des structures
  * @returns un tableau contenant la liste des saisons
  */
  recupererPuyfolais(filtre: string): Observable<Puyfolais[]> {

    const q = query(this.puyfolaisRef, or(
      and(where('nom', '>=', filtre), where('nom', '<=', filtre + '\uf8ff')),
      and(where('prenom', '>=', filtre), where('prenom', '<=', filtre + '\uf8ff')),
      and(where('email', '>=', filtre), where('email', '<=', filtre + '\uf8ff')),
      and(where('numero', '==', parseInt(filtre)))
    ), limit(50));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const data = doc.data();
        const uid = doc.id;
        // Conversion du champ dateNaissance de Timestamp à Date
        if (data['dateNaissance'] instanceof Timestamp) {
          data['dateNaissance'] = data['dateNaissance'].toDate();
        }
        data['nom'] = this.transformLettreMaj(data['nom'])
        data['prenom'] = this.transformPremiereLettreMaj(data['prenom'])
        data['adresse'] = this.transformPremiereLettreMaj(data['adresse'])
        data['uid'] = uid
        return data as Puyfolais;
      }))
    );
  }

  transformLettreMaj(nom: string | undefined): string {
    if (nom) {
      return nom.toUpperCase();
    } else {
      return ''
    }
  }

  transformPremiereLettreMaj(prenom: string | undefined): string {
    if (prenom) {
      return prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    } else {
      return ''
    }
  }

}
