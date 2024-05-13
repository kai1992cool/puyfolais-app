import { Component, Input } from '@angular/core';
import { SeancePossiblePeriode } from '../../model/seance-possible-periode';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { EtatSeance } from '../../../enum/etat-seances';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent {

  @Input() seancePossiblePeriode!: SeancePossiblePeriode;

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

ajouterSeance() {

}

}
