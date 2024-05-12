import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ISaison } from '../interface/saison';
import { EtatSaison } from '../enum/etat-saison';
import { EnumTraductionService } from './enum-traduction.service';

@Injectable({
  providedIn: 'root'
})
export class SaisonService {

  constructor(
    private firestore: AngularFirestore,
    private traductionEnumService: EnumTraductionService
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
   * Supprime une saison
   * @param uid l'UID de la saison à supprimer
   * @returns  Le promise résultant de la suppression
   */
  supprimerSaison(uid: string): Promise<void> {
      return this.firestore.collection('saisons').doc(uid).delete();
  }

  /**
   * Met à jour une saison utilisateur
   * @param saison l'objet Saison à mettre à jour
   * @returns  Le promise résultant de la mise à jour
   */
  mettreAJourSaison(saison: ISaison) : Promise<void> {
    return this.firestore.collection('saisons').doc(saison.uid).update(saison).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour de la saison :", error);
    });
  }
  /**
   * Retourne la liste des saisons
   * @returns un tableau contenant la liste des saisons
   */
  recupererSaisons(): Observable<ISaison[]> {
    return this.firestore.collection('saisons').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as ISaison;
          data.uid = action.payload.doc.id;
          return { ...data };
        });
      })
    );
  }

  /**
   * Contrôle si une période est déjà couverte par une saison existante
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

    /**
   * Contrôle si une saison contient des séances
   * @param uidSaison L'identifiant de la saison
   * @returns True si une saison possède au moins une séance
   */
    verifierSeancesExistantesSaison(uidSaison: string): Observable<boolean> {
      return this.firestore.collection('saisons').doc(uidSaison).get().pipe(
        map(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data() as ISaison;
            if (userData.seances) {
            return userData.seances.length > 0 ;
            } else {
              return false
            }
          } else {
            return false;
          }
        })
      );
    }

    /**
     * Retourne l'état en Enum d'une saison
     * @param saison La saison a traiter
     * @returns l'enum EtatSaison associé et son libéllé tradit dans un MAP
     */
    detecterEtatSaison(saison: ISaison): Map<EtatSaison, string> {
      const now = new Date();
      const dateDebut = saison.dateDebut.toDate();
      const dateFin = saison.dateFin.toDate();
    
      const etatsMap: Map<EtatSaison, string> = new Map();
    
      if (dateFin < now) {
        etatsMap.set(EtatSaison.PAS, this.traductionEnumService.traduireEtatSaison(EtatSaison.PAS));
      } else if (dateDebut <= now && dateFin >= now) {
        etatsMap.set(EtatSaison.ENC, this.traductionEnumService.traduireEtatSaison(EtatSaison.ENC));
      } else {
        etatsMap.set(EtatSaison.AVN, this.traductionEnumService.traduireEtatSaison(EtatSaison.AVN));
      }
    
      return etatsMap;
    }
}
