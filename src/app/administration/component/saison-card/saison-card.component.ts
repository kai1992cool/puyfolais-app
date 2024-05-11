import { Component, Input, OnInit } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { Timestamp } from '@firebase/firestore'; 
import { EtatSaison } from '../../../enum/etat-saison';

@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrl: './saison-card.component.scss'
})
export class SaisonCardComponent  {
  @Input() saison!: ISaison;



  // Méthode pour déterminer l'état de la saison
  getSaisonStatusText(saison: ISaison): string {
    const now = new Date();
    const dateDebut = this.saison.dateDebut.toDate();
    const dateFin = this.saison.dateFin.toDate(); 
    
    if (dateFin < now) {
      return EtatSaison.PAS;
    } else if (dateDebut <= now && dateFin >= now) {
      return EtatSaison.ENC;
    } else {
      return EtatSaison.AVN;
    }
  }

  // Méthode pour obtenir la couleur du badge en fonction de l'état de la saison
  getSaisonStatusColor(saison: ISaison): string {
    const now = new Date();
    const dateDebut = this.saison.dateDebut.toDate();
    const dateFin = this.saison.dateFin.toDate(); 

    if (dateFin < now) {
      // A venir
      return 'blue';
    } else if (dateDebut <= now && dateFin >= now) {
      // En cours
      return 'green';
    } else {
      // Terminé
      return 'orange';
    }
  }

  toDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }
}
