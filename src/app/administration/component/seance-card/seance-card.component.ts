import { Component, Input } from '@angular/core';
import { SeanceTravail } from '../../model/seance-travail';
import { EnumTraductionService } from '../../../service/enum-traduction.service';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent {

  @Input() seanceTravail!: SeanceTravail;

  constructor(
    public traductionEnumService: EnumTraductionService
  ) { }

}
