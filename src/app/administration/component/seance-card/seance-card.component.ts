import { Component,  EventEmitter,  Input, OnInit, Output } from '@angular/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { EtatSeance } from '../../../enum/etat-seances';
import { Seance } from '../../../model/seance';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent implements OnInit {

  @Input() seance!: Seance;
  @Output() emitSupprimerNouvelleSeance: EventEmitter<Seance> = new EventEmitter<Seance>();

  seanceInitial!: Seance ;

  constructor(
    public traductionEnumService: EnumTraductionService
  ) { }

  ngOnInit(): void {
    this.seanceInitial = new Seance(this.seance.uid, this.seance.date, this.seance.type);
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
    if (this.seance.uid !== '') {
    this.seance.supprimee = !this.seance.supprimee;
  } else {
    this.emitSupprimerNouvelleSeance.emit(this.seance);
  }
}

  ajusterHeureSeance(minutes: number): void {
    const date = new Date(this.seance.date);
    date.setMinutes(date.getMinutes() + minutes);
    this.seance.date = date;
    this.seance.miseAJour =  this.verifierMaj();
  }

  // Obtenez EtatSeance en filtrant la valeur exclue
  recupererEtatSeanceAAfficher(): EtatSeance[] {
    return Object.values(EtatSeance)
    .filter(value => value !== EtatSeance.NDE)
    .map(name => EtatSeance[name as keyof typeof EtatSeance]);
  }

  choisirTypeSeance(type: EtatSeance) {
    this.seance.type = type
    this.seance.miseAJour = this.verifierMaj();
  }

  private verifierMaj(): boolean {
    return !(this.seance.date.getTime() === this.seanceInitial.date.getTime()) 
        || !(this.seance.type === this.seanceInitial.type);
  }
}


