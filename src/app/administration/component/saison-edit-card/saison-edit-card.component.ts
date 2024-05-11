import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISaison } from '../../../interface/saison';

@Component({
  selector: 'app-saison-edit-card',
  templateUrl: './saison-edit-card.component.html',
  styleUrl: './saison-edit-card.component.scss'
})
export class SaisonEditCardComponent {
  @Output() editionSaisonValidee: EventEmitter<ISaison> = new EventEmitter<ISaison>();
  @Output() annulerEditionSaisonDemandee: EventEmitter<void> = new EventEmitter<void>(); 
  @Input()
  saison!: ISaison;

  validerMiseAJourSaison() {
    this.editionSaisonValidee.emit(this.saison);
  }

  annulerMiseAJourSaison() {
    this.annulerEditionSaisonDemandee.emit()
  }

  formulaireValide(): boolean {
    // Vérifiez si tous les champs requis sont remplis
    return !!this.saison?.libelle && !!this.saison?.dateDebut && !!this.saison?.dateFin;
  }
}
