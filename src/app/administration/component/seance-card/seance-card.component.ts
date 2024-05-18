import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { EtatSeance } from '../../../enum/etat-seances';
import { Seance } from '../../../model/seance';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent {

  @Input() seance!: Seance;

  constructor(
    public traductionEnumService: EnumTraductionService
  ) { }

  determinerCouleurSeance(type?: EtatSeance): string {
    switch (type) {
        case EtatSeance.REP:
            return 'blue';
        case EtatSeance.NOR:
            return 'green';
        case EtatSeance.SPE:
            return 'yellow';
        default:
            return 'white'; // Couleur par défaut si le type n'est pas reconnu
    }
}

supprimerSeance() {
  this.seance.supprimee = ! this.seance.supprimee;
  }

}
