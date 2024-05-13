import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';
import { ISeance } from '../../../interface/seance';
import { SeanceService } from '../../../service/seance.service';
import { SeanceTravail } from '../../model/seance-travail';

@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrls: ['./saison-card.component.scss']
})
export class SaisonCardComponent implements OnInit {

  @Input() saison!: ISaison;
  @Output() suppressionEffectuee: EventEmitter<void> = new EventEmitter<void>();
  @Output() editionSaisonDemandee: EventEmitter<ISaison> = new EventEmitter<ISaison>();
  @Output() planningSaison: EventEmitter<ISaison> = new EventEmitter<ISaison>();
  @Output() editionSaisonValidee: EventEmitter<ISaison> = new EventEmitter<ISaison>();
  @Output() annulerEditionSaisonDemandee: EventEmitter<void> = new EventEmitter<void>();

  texteBadgeSaison: string = '';
  etatSaisonTraduit: Map<EtatSaison, string> = new Map();
  couleurBadgeSaison: string = '';
  suppressionImpossible: boolean = true;
  saisonConvertie!: Saison;
  editionDemandee: boolean = false;
  planningDemande: boolean = false;
  listeJoursPeriode: SeanceTravail[] = [];
  listeSeances: ISeance[] = [];

  constructor(
    public saisonService: SaisonService,
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    private seanceService: SeanceService
  ) { }

  ngOnInit(): void {
    this.saisonConvertie = new Saison(this.saison);
    this.dateAdapter.setLocale(this.traductionService.currentLang);
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
    if (!this.suppressionImpossible) {
      this.saisonService.supprimerSaison(arg0.uid).then(() => {
        this.suppressionEffectuee.emit();
      })
    }
  }

  editerSaison() {
    this.editionDemandee = true;
  }

  editerPlanningSaison() {
    if (this.planningDemande) {
      this.planningDemande = false
    } else {
      this.recupererTousLesJoursDeLaSaison();
      this.recupererSeancesExistantes();
      this.planningDemande = true;
    }
  }

  recupererMessageSuppressionImpossible(): string {
    return this.suppressionImpossible ? this.traductionService.instant('admin.saisons.blocageSuppression') : '';
  }

  validerMiseAJourSaison() {
    this.recupererMajDansSaison();

    this.editionSaisonValidee.emit(this.saison);
  }

  annulerMiseAJourSaison() {
    this.editionDemandee = false;
  }

  recupererMajDansSaison() {
    this.saison.libelle = this.saisonConvertie.libelle;
    this.saison.dateDebut = Timestamp.fromDate(this.saisonConvertie.dateDebut);
    this.saison.dateFin = Timestamp.fromDate(this.saisonConvertie.dateFin);
  }

  formulaireValide(): boolean {
    return !!this.saisonConvertie?.libelle && !!this.saisonConvertie?.dateDebut && !!this.saisonConvertie?.dateFin && this.saisonConvertie.dateDebut <= this.saisonConvertie.dateFin;
  }

  /**
   * Ce code récupère pour la saison chaque séance dans la collection firestore pour ensuite etre rapproché avec les jours de la période
   */
  recupererSeancesExistantes(): void {
    this.seanceService.recupererListeSeance(this.saison.seances)
      .subscribe(seances => {
        this.listeSeances = seances
        this.rapprocherSeancesExistantes();
      })
  }

  /**
   * Réalise un rapprochement entre la liste des seances affectées à la saison et la liste des jours de la période
   * Chaque jour du tableau concerné par une séance existante est mise à jour avec la dite séance
   * Ce tableau servira à l'alimentation du composant HTML
   */
  rapprocherSeancesExistantes(): void {
    this.listeSeances.forEach(seance => {
      const seanceDate = seance.date.toDate();
      const jour = this.listeJoursPeriode.find(jour => this.compareDates(jour.date, seanceDate));
      if (jour) {
        jour.seance = seance;
        jour.selectionne = true;
      }
    });
    this.listeJoursPeriode.forEach(seance => console.log(seance.seance))

  }

  /**
   * Pour une saison donnée, met à jour le tableau des jours de la saison en initialisant des Seances
   */
  recupererTousLesJoursDeLaSaison(): void {
    const jours: SeanceTravail[] = [];
    const dateDebut = new Date(this.saison.dateDebut.toDate());
    let dateActuelle = dateDebut;
    const dateFin = new Date(this.saison.dateFin.toDate());

    while (dateActuelle <= dateFin) {
      const dateAInserer = new Date(dateActuelle);
      jours.push(new SeanceTravail(dateAInserer));
      dateActuelle.setDate(dateActuelle.getDate() + 1);
    }

    this.listeJoursPeriode = jours;
  }

  compareDates(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}


/**
 * Cette classe est créé uniquement pour gérer la conversion timestamp <> Date pour l'utilisation des matDatePicker
 */
class Saison {
  dateDebut!: Date;
  seances: any[]; // Ajoutez le type approprié pour votre application
  libelle: string;
  dateFin!: Date;
  uid: string;

  constructor(saison: ISaison) {
    this.dateDebut = saison.dateDebut.toDate();
    this.seances = saison.seances;
    this.libelle = saison.libelle;
    this.dateFin = saison.dateFin.toDate();
    this.uid = saison.uid;
  }
}