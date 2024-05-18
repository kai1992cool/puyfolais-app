import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { SeanceService } from '../../../service/seance.service';
import { Saison } from '../../../model/saison';
import { Seance } from '../../../model/seance';
import { EtatSeance } from '../../../enum/etat-seances';


@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrls: ['./saison-card.component.scss']
})
export class SaisonCardComponent implements OnInit {

  @Input() saison!: Saison;

  readonly FILTRE_JOURS_VEN_SAM: number[] = [5, 6];
  readonly FILTRE_MOIS_TOUS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  texteBadgeSaison: string = '';
  etatSaisonTraduit: Map<EtatSaison, string> = new Map();
  couleurBadgeSaison: string = '';
  suppressionImpossible: boolean = true;
  editionDemandee: boolean = false;
  planningDemande: boolean = false;
  listeJoursFiltresActifs: number[] = this.FILTRE_JOURS_VEN_SAM.slice();;
  listeMoisFiltresActifs: number[] = this.FILTRE_MOIS_TOUS.slice();;
  listeSeances: Seance[] = [];

  constructor(
    public saisonService: SaisonService,
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    private seanceService: SeanceService
  ) { }

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.traductionService.currentLang);
    this.detecterTexteEtCouleurBadgeSaison();
    this.verifierPossibiliteSupprimerSaison(this.saison);
  }

  private detecterTexteEtCouleurBadgeSaison() {
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

  // Suppression d'une saison
  //*************************

  /**
   * Vérifie qu'il n'existe pas de séances existante pour valider la demande de suppression
   * @param arg0 La saison à vérifié émise par la card
   */
  private verifierPossibiliteSupprimerSaison(arg0: Saison) {
    this.saisonService.verifierSeancesExistantesSaison(arg0.uid).subscribe(seanceExist => {
      this.suppressionImpossible = seanceExist;
    })
  }

  /**
   * Supprime la saison
   * @param arg0 La saison à vérifié émise par la card
   */
  supprimerSaison(arg0: Saison) {
    if (!this.suppressionImpossible) {
      this.saisonService.supprimerSaison(arg0.uid).then(() => {
      })
    }
  }

  /**
   * Traduit le message à afficher en cas d'impossibilité de suppression
   * @returns Le message traduit
   */
  recupererMessageSuppressionImpossible(): string {
    return this.suppressionImpossible ? this.traductionService.instant('admin.saisons.blocageSuppression') : '';
  }

  // Edition d'une saison
  //*********************

  /**
   * Active le bloc d'édition d'une saison (et désative le bloc de visualisation)
   */
  editerSaison() {
    this.editionDemandee = true;
  }

  /**
   * Valide la mise à jour en BDD
   */
  validerMiseAJourSaison() {

    this.saisonService.mettreAJourSaison(this.saison).then(() => {
      this.editionDemandee = false;
    })
  }

  /**
   * Masque le bloc d'édition et réaffiche le bloc de visualisation
   */
  annulerMiseAJourSaison() {
    this.editionDemandee = false;
  }

  /**
   * Réalise les contrôle sur le formulaire
   * @returns True ou False
   */
  formulaireValide(): boolean {
    return !!this.saison?.libelle && !!this.saison?.dateDebut && !!this.saison?.dateFin && this.saison.dateDebut <= this.saison.dateFin;
  }


  // Edition des séances
  //********************

  /**
   * Active le bloc de gestion du planning (ou l'annule si nouveau clic)
   */
  editerPlanningSaison() {
    if (this.planningDemande) {
      this.planningDemande = false
    } else {
      this.recupererSeancesExistantes();
      this.planningDemande = true;
    }
  }

  /**
   * Ce code récupère pour la saison chaque séance dans la collection firestore pour ensuite etre rapproché avec les jours de la période
   */
  private recupererSeancesExistantes(): void {
    this.seanceService.recupererListeSeance(this.saison.seances)
      .subscribe(listeSeancesBdd => {

        listeSeancesBdd.forEach(seanceBdd => {
          this.listeSeances.push(seanceBdd)
        })
      })
  }

  selectionDateSeanceCalendrier(selectedDate: Date) {
    const seancesADate = this.listeSeances.filter(seance => seance.seanceADate(selectedDate))

    if (seancesADate.length === 0) {
      const nouvelleSeance = new Seance('', selectedDate, EtatSeance.NOR)
      nouvelleSeance.creation = true
      this.listeSeances.push(nouvelleSeance)
    } else {
      const duplicationSeance = new Seance('', selectedDate, EtatSeance.NOR)
      duplicationSeance.creation = true
      this.listeSeances.push(duplicationSeance)
    }
  }

  
}

