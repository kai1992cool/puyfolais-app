import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';

@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrls: ['./saison-card.component.scss']
})
export class SaisonCardComponent implements OnInit {

  @Input() saison!: ISaison;
  @Output() suppressionEffectuee: EventEmitter<void> = new EventEmitter<void>();
  @Output() editionSaisonDemandee: EventEmitter<ISaison> = new EventEmitter<ISaison>();

  texteBadgeSaison: string = '';
  etatSaisonTraduit: Map<EtatSaison, string> = new Map();
  couleurBadgeSaison: string = '';
  suppressionImpossible: boolean = true;

  constructor(
    public saisonService: SaisonService,
  ) { }

  ngOnInit(): void {
    this.detecterTexteEtCouleurBadgeSaison();
    this.verifierPossibiliteSupprimerSaison(this.saison);
  }

  detecterTexteEtCouleurBadgeSaison() {
    this.etatSaisonTraduit = this.saisonService.detecterEtatSaison(this.saison);
    this.texteBadgeSaison = this.etatSaisonTraduit.values().next().value;
    const etatSaison = this.etatSaisonTraduit.keys().next().value; 
    switch (etatSaison) {
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

  verifierPossibiliteSupprimerSaison(arg0: ISaison) {
    this.saisonService.verifierSeancesExistantesSaison(arg0.uid).subscribe(seanceExist => {
      this.suppressionImpossible = seanceExist;
    })
  }

  supprimerSaison(arg0: ISaison) {
    this.saisonService.supprimerSaison(arg0.uid).then(() => {
      this.suppressionEffectuee.emit();
    })
  }

  editerSaison(arg0: ISaison) {
    this.editionSaisonDemandee.emit(arg0);
  }
}
