import { Component, Input, OnInit } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { Timestamp } from '@firebase/firestore';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrl: './saison-card.component.scss'
})
export class SaisonCardComponent implements OnInit {

  @Input() saison!: ISaison;
  @Output() suppressionEffectuee: EventEmitter<void> = new EventEmitter<void>();

  texteBadgeSaison: string = '';
  couleurBadgeSaison: string = '';
  suppressionImpossible: boolean = true;

  constructor(
    public saisonService: SaisonService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.detecterTexteEtCouleurBadgeSaison();
    this.verifierPossibiliteSupprimerSaison(this.saison);
  }

  /**
   * Détecte le texte et la couleur à afficher pour l'état d'une saison en fonction de la date du jour
   */
  detecterTexteEtCouleurBadgeSaison() {
    this.texteBadgeSaison = this.saisonService.detecterEtatSaison(this.saison);
    switch (this.texteBadgeSaison) {
      case EtatSaison.AVN:
        this.couleurBadgeSaison = 'blue';
        break;
      case EtatSaison.PAS:
        this.couleurBadgeSaison = 'orange';
        break;
      case EtatSaison.ENC:
        this.couleurBadgeSaison = 'green';
        break;
      default:
        this.couleurBadgeSaison = 'yellow';
        break;
    }
  }

  /**
   * 
   * @param timestamp Permet de convertir une date au format Timestamp (Firestore) en Date (JS)
   * @returns La date Timestamp au format Date
   */
  timestampVersDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  /**
   * Permet de supprimer une saison uniquement si aucune séance ne sont planifiées
   * @param arg0 La saison sélectionnées par l'utilisateur
   */
  verifierPossibiliteSupprimerSaison(arg0: ISaison) {
    this.saisonService.verifierSeancesExistantesSaison(arg0.uid).subscribe(seanceExist => {
      if (seanceExist) {
        this.suppressionImpossible = true;
      } else {
        this.suppressionImpossible = false;
      }
    })
  }

  /**
 * Permet de supprimer une saison 
 * @param arg0 La saison sélectionnées par l'utilisateur
 */
  supprimerSaison(arg0: ISaison) {
    this.saisonService.supprimerSaison(arg0.uid).then(() => {
      this.suppressionEffectuee.emit();
    })
  }

  editerSaison(arg0: ISaison) {
    throw new Error('Method not implemented.');
  }
}
