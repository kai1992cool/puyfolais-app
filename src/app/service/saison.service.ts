import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, map, take } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ISaison } from '../interface/saison';

@Injectable({
  providedIn: 'root'
})
export class SaisonService {

  constructor(
    private firestore: AngularFirestore,
    public authentificationFirebaseAngular: AngularFireAuth
  ) { }

  /**
   * Créé une saison dans Firestore
   * @param libelle Le libellé de la saison (Année)
   * @param dateDebut La date de début de la saison
   * @param dateFin La date de fin de la saison
   * @param listSeances La liste des séances
   * @returns L'identifiant technique de la saison
   */
  creerSaison(libelle: string, dateDebut: Date, dateFin: Date, listSeances?: ISaison[]): Promise<DocumentReference<any>> {
    if (!listSeances) {
      return this.firestore.collection('saisons').add({ libelle, dateDebut, dateFin });
    } else {
      return this.firestore.collection('saisons').add({ libelle, dateDebut, dateFin, listSeances });
    }
  }

  /**
   * Retourne la liste des saisons
   * @returns un tableau contenant la liste des saisons
   */
  recupererSaisons(): Observable<ISaison[]> {
    return this.firestore.collection('saisons').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data() as ISaison;
          return { id, ...data };
        });
      })
    );
  }

  /**
   * Contrôle si une prériode est déjà couverte par une saison existante
   * @param dateDebut Date de début de la période à tester
   * @param dateFin Date de fin de la période à tester
   * @returns True si une saison chevauche la période
   */
  verifierChevauchementSaison(dateDebut: Date, dateFin: Date): Observable<boolean> {
    return this.firestore.collection<ISaison>('saisons', ref =>
      ref.where('dateFin', '>=', dateDebut) // La date de fin de la saison est postérieure ou égale à la date de début fournie
         .where('dateDebut', '<=', dateFin) // La date de début de la saison est antérieure ou égale à la date de fin fournie
    ).get().pipe(
      map(snapshot => !snapshot.empty) // Vérifie si la collection est vide ou non
    );
  }
}
