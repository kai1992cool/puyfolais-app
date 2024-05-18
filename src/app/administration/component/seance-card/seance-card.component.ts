import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { EtatSeance } from '../../../enum/etat-seances';
import { Seance } from '../../../model/seance';
import { Time } from '@angular/common';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent implements OnInit {

  @Input() seance!: Seance;
  seanceInitialDate!: Date;

  constructor(
    public traductionEnumService: EnumTraductionService
  ) { }

  ngOnInit(): void {
    this.seanceInitialDate = new Date(this.seance.date);
  }

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
    this.seance.supprimee = !this.seance.supprimee;
  }

  ajusterHeureSeance(minutes: number): void {
    const date = new Date(this.seance.date);
    date.setMinutes(date.getMinutes() + minutes);
    this.seance.date = date;
    this.seance.miseAJour = !(this.seance.date.getTime() === this.seanceInitialDate.getTime());
  }


}
