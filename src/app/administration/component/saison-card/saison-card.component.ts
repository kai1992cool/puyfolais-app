import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { Timestamp } from '@firebase/firestore';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { MatDialog } from '@angular/material/dialog';

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

  timestampVersDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
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
