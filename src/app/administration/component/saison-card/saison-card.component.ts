import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';
import { ISeance } from '../../../interface/seance';
import { SeanceService } from '../../../service/seance.service';
import { SeancePossiblePeriode } from '../../model/seance-possible-periode';


@Component({
  selector: 'app-saison-card',
  templateUrl: './saison-card.component.html',
  styleUrls: ['./saison-card.component.scss']
})
export class SaisonCardComponent implements OnInit {

  @Input() saison!: ISaison;

  texteBadgeSaison: string = '';
  etatSaisonTraduit: Map<EtatSaison, string> = new Map();
  couleurBadgeSaison: string = '';
  suppressionImpossible: boolean = true;
  editionDemandee: boolean = false;
  planningDemande: boolean = false;
  listeSeancesPossiblePeriode: SeancePossiblePeriode[] = [];
  listeSeancesPossiblePeriodeFiltree: SeancePossiblePeriode[] = [];
  listeJoursFiltresActifs: string[] = ['vendredi', 'samedi']
  listeMoisFiltresActifs: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  listeSeances: ISeance[] = [];

  // Nécessaire pour gérer la conversion entre les DatePicker (Date) et Firestore (Timestamp)
  dateDebutFormatee!: Date;
  dateFinFormatee!: Date;

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
  private verifierPossibiliteSupprimerSaison(arg0: ISaison) {
    this.saisonService.verifierSeancesExistantesSaison(arg0.uid).subscribe(seanceExist => {
      this.suppressionImpossible = seanceExist;
    })
  }

  /**
   * Supprime la saison
   * @param arg0 La saison à vérifié émise par la card
   */
  supprimerSaison(arg0: ISaison) {
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
    this.dateDebutFormatee = this.saison.dateDebut.toDate();
    this.dateFinFormatee = this.saison.dateFin.toDate();
    this.editionDemandee = true;
  }

  /**
   * Valide la mise à jour en BDD
   */
  validerMiseAJourSaison(libelle: string, dateDebut: Date, dateFin: Date) {

    this.saison.libelle = libelle;
    this.saison.dateDebut = Timestamp.fromDate(dateDebut);
    this.saison.dateFin = Timestamp.fromDate(dateFin);

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

  lorsChangementDatePicker(event: any, type: string) {
    const selectedDate = event.value;
    if (type === 'deb') {
      this.saison.dateDebut = Timestamp.fromDate(selectedDate);
      return
    }
    if (type === 'fin') {
      this.saison.dateFin = Timestamp.fromDate(selectedDate);
      return
    }
    throw new Error('Type de date invalide');
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
      this.recupererDatesSeancesPossiblesSaison();
      this.recupererSeancesExistantes();
      this.toggleFiltre(undefined, undefined);
      this.planningDemande = true;
    }
  }

  /**
   * Pour une saison donnée, met à jour le tableau des jours de la saison en initialisant des Seances
   */
  private recupererDatesSeancesPossiblesSaison(): void {
    const jours: SeancePossiblePeriode[] = [];
    const dateDebut = new Date(this.saison.dateDebut.toDate());
    let dateActuelle = dateDebut;
    const dateFin = new Date(this.saison.dateFin.toDate());

    while (dateActuelle <= dateFin) {
      const dateAInserer = new Date(dateActuelle);
      jours.push(new SeancePossiblePeriode(dateAInserer));
      dateActuelle.setDate(dateActuelle.getDate() + 1);
    }

    this.listeSeancesPossiblePeriode = jours;
    this.listeSeancesPossiblePeriodeFiltree = jours;
  }

  /**
   * Ce code récupère pour la saison chaque séance dans la collection firestore pour ensuite etre rapproché avec les jours de la période
   */
  private recupererSeancesExistantes(): void {
    this.seanceService.recupererListeSeance(this.saison.seances)
      .subscribe(seances => {
        this.listeSeances = seances
        this.rapprocherSeancesExistantes();
      })
  }

  /**
  * Réalise un rapprochement entre la liste des seances affectées à la saison et la liste des jours de la période
  * Il s'agit de mettre à jour l'indicateur de sélection de la liste des dates possible
  */
  private rapprocherSeancesExistantes(): void {
    this.listeSeances.forEach(seance => {
      const seanceDate = seance.date.toDate();
      const jour = this.listeSeancesPossiblePeriode.find(jour => this.compareDates(jour.date, seanceDate));
      if (jour) {
        jour.selectionne = true;
      }
    });
  }

  /**
   * Méthode pour tester si les dates des séances possibles et existantes sont identique
   * @param date1 La première date à tester
   * @param date2 La seconde date à tester
   * @returns True ou False
   */
  private compareDates(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Filtre la liste des dates sélectionnables qui ne sont pas encore affectée à la saison
   * @returns La liste des dates non sélectionnées
   */
  recupererSeancesPossiblesNonSelectionnees(): SeancePossiblePeriode[] {
    return this.listeSeancesPossiblePeriodeFiltree.filter(seance => !seance.selectionne);
  }

  // Méthode pour filtrer les éléments en fonction du jour de la semaine sélectionné
  toggleFiltre(jour: string |undefined, mois:string |undefined) {
    // Activez ou désactivez le filtre pour le jour sélectionné
    // Par exemple, vous pouvez avoir un tableau de jours sélectionnés
    // ou un objet qui stocke les états de sélection des jours

    // Ici, je vais supposer que vous avez un tableau de jours sélectionnés

    if (jour) {
    const index = this.listeJoursFiltresActifs.indexOf(jour);
    if (index !== -1) {
      // Si le jour est déjà sélectionné, le retirez
      this.listeJoursFiltresActifs.splice(index, 1);
    } else {
      // Sinon, ajoutez-le
      this.listeJoursFiltresActifs.push(jour);
    }
  }

  if (mois) {
    const index = this.listeMoisFiltresActifs.indexOf(mois);
    if (index !== -1) {
      // Si le jour est déjà sélectionné, le retirez
      this.listeMoisFiltresActifs.splice(index, 1);
    } else {
      // Sinon, ajoutez-le
      this.listeMoisFiltresActifs.push(mois);
    }
  }

    // Filtrer les séances en fonction des jours sélectionnés
    this.listeSeancesPossiblePeriodeFiltree = this.listeSeancesPossiblePeriode.filter(seance => {
      const seanceJour = seance.date.getDay();
      const seanceMois = seance.date.getMonth();
      // Vérifiez si le jour de la semaine de la séance est dans le tableau des jours sélectionnés
      return this.listeJoursFiltresActifs.includes(this.getNomJour(seanceJour)) && this.listeMoisFiltresActifs.includes(this.getNomMois(seanceMois));
    });
  }

  // Méthode pour obtenir le nom du jour à partir de l'index du jour de la semaine
  getNomJour(index: number): string {
    const jours: string[] = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return jours[index];
  }

  getNomMois(index: number): string {
    const mois: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return mois[index];
  }

  isFilterJourActive(jour: string): boolean {
    // Logique pour déterminer si le filtre est actif ou non
    // Par exemple, vous pouvez utiliser une liste de filtres actifs
    return this.listeJoursFiltresActifs.includes(jour); // suppose que listeFiltresActifs contient les jours actifs
  }

  isFilterMoisActive(mois: string): boolean {
    // Logique pour déterminer si le filtre est actif ou non
    // Par exemple, vous pouvez utiliser une liste de filtres actifs
    return this.listeMoisFiltresActifs.includes(mois); // suppose que listeFiltresActifs contient les jours actifs
  }
}
