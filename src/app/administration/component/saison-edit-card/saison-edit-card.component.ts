import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { Timestamp } from '@angular/fire/firestore';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-saison-edit-card',
  templateUrl: './saison-edit-card.component.html',
  styleUrl: './saison-edit-card.component.scss'
})
export class SaisonEditCardComponent implements OnInit {

  @Output() editionSaisonValidee: EventEmitter<ISaison> = new EventEmitter<ISaison>();
  @Output() annulerEditionSaisonDemandee: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  saison!: ISaison;
  saisonConvertie!: Saison;

  constructor(
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    this.saisonConvertie = new Saison(this.saison);
    this.dateAdapter.setLocale(this.traductionService.currentLang);
  }

  validerMiseAJourSaison() {
    this.recupererMajDansSaison();
    this.editionSaisonValidee.emit(this.saison);
  }

  annulerMiseAJourSaison() {
    this.annulerEditionSaisonDemandee.emit()
  }

  formulaireValide(): boolean {
    return !!this.saisonConvertie?.libelle && !!this.saisonConvertie?.dateDebut && !!this.saisonConvertie?.dateFin && this.saisonConvertie.dateDebut <= this.saisonConvertie.dateFin;
  }

  convertirTimestampFirestoreVersDate(timestamp: Timestamp): Date | null {
    return timestamp ? timestamp.toDate() : null;
  }

  recupererMajDansSaison( )  {
    this.saison.libelle = this.saisonConvertie.libelle;
    this.saison.dateDebut = Timestamp.fromDate(this.saisonConvertie.dateDebut);
    this.saison.dateFin = Timestamp.fromDate(this.saisonConvertie.dateFin);
  }
}

/**
 * Cette classe est créé uniquement pour gérer la conversion timestamp <> Date pour l'utilisation des matDatePicker
 */
class Saison {
  dateDebut!: Date ;
  seances: any[]; // Ajoutez le type approprié pour votre application
  libelle: string;
  dateFin!: Date ;
  uid: string;

  constructor(saison: ISaison) {
    this.dateDebut =  saison.dateDebut.toDate() ;
    this.seances = saison.seances;
    this.libelle = saison.libelle;
    this.dateFin =  saison.dateFin.toDate() ;
    this.uid = saison.uid;
  }

}