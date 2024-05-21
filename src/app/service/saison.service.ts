import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { ISaison } from '../interface/saison';
import { EtatSaison } from '../enum/etat-saison';
import { EnumTraductionService } from './enum-traduction.service';
import { Timestamp } from 'firebase/firestore';
import { Saison } from '../model/saison';
import { SeanceService } from './seance.service';

@Injectable({
  providedIn: 'root'
})
export class SaisonService {

  constructor(
    private firestore: AngularFirestore,
    private traductionEnumService: EnumTraductionService,
    private seanceService: SeanceService
  ) { }

  collection: AngularFirestoreCollection<ISaison> = this.firestore.collection<ISaison>('saisons')


  /**
   * Créé une saison dans Firestore
   * @param libelle Le libellé de la saison (Année)
   * @param dateDebut La date de début de la saison
   * @param dateFin La date de fin de la saison
   * @param listSeances La liste des séances
   * @returns L'identifiant technique de la saison
   */
  creerSaison(libelle: string, dateDebut: Date, dateFin: Date): Promise<DocumentReference<any>> {
    const dateDebutTimestamp = Timestamp.fromDate(dateDebut);
    const dateFinTimestamp = Timestamp.fromDate(dateFin);
    return this.collection.add({
      libelle,
      dateDebut: dateDebutTimestamp,
      dateFin: dateFinTimestamp,
      seances: []
    });
  }

  /**
   * Supprime une saison
   * @param uid la saison à supprimer
   * @returns  Le promise résultant de la suppression
   */
  async supprimerSaison(saison: Saison): Promise<void> {
    try {
      // Supprimer toutes les séances associées
      const suppressionSeances = saison.seances!.map(seanceRef => seanceRef.delete());
      await Promise.all(suppressionSeances);

      // Supprimer la saison après la suppression des séances
      await this.collection.doc(saison.uid).delete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la saison :", error);
      throw error;
    }
  }

  /**
   * Met à jour une saison 
   * @param saison l'objet Saison à mettre à jour
   * @returns  Le promise résultant de la mise à jour
   */
  mettreAJourSaison(saison: Saison): Promise<void> {

    const isaison: ISaison = {
      libelle: saison.libelle!,
      dateDebut: Timestamp.fromDate(saison.dateDebut!),
      dateFin: Timestamp.fromDate(saison.dateFin!),
      seances: saison.seances!
    };

    return this.collection.doc(saison.uid).update(isaison).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour de la saison :", error);
    });
  }

  /**
   * Retourne la liste des saisons
   * @returns un tableau contenant la liste des saisons
   */
  recupererSaisons(): Observable<Saison[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const firestoreData = action.payload.doc.data() as ISaison;
          const uid = action.payload.doc.id;

          // Transformation des dates de Timestamp en Date
          const dateDebut = (firestoreData.dateDebut as Timestamp).toDate();
          const dateFin = (firestoreData.dateFin as Timestamp).toDate();

          // Construction de l'objet ISaison
          const saison: Saison = {
            uid: uid,
            libelle: firestoreData.libelle,
            dateDebut: dateDebut,
            dateFin: dateFin,
            seances: firestoreData.seances
          };

          return saison;
        });
      })
    );
  }

   /**
 * Contrôle si une saison contient des séances
 * @param uidSaison L'identifiant de la saison
 * @returns True si une saison possède au moins une séance
 */
  verifierSeancesExistantesSaison(uidSaison: string): Observable<boolean> {
    return this.collection.doc(uidSaison).get().pipe(
      map(documentSnapshot => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data() as ISaison;
          if (userData.seances) {
            return userData.seances.length > 0;
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
  detecterEtatSaison(saison: Saison): Map<EtatSaison, string> {
    const now = new Date();
    const etatsMap: Map<EtatSaison, string> = new Map();

    if (saison.dateFin! < now) {
      etatsMap.set(EtatSaison.PAS, this.traductionEnumService.traduireEtatSaison(EtatSaison.PAS));
    } else if (saison.dateDebut! <= now && saison.dateFin! >= now) {
      etatsMap.set(EtatSaison.ENC, this.traductionEnumService.traduireEtatSaison(EtatSaison.ENC));
    } else {
      etatsMap.set(EtatSaison.AVN, this.traductionEnumService.traduireEtatSaison(EtatSaison.AVN));
    }

    return etatsMap;
  }

  mettreAjourListeLienSeances(uid: string, listeRef: DocumentReference<unknown>[]): Promise<void> {
    return this.firestore.collection("saisons").doc(uid).update({
      seances: listeRef
    });
  }
}
