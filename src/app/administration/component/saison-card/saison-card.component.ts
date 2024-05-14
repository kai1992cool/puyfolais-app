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
  listeSeancesPossiblePeriode: SeancePossiblePeriode[] = [];
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
        this.suppressionEffectuee.emit();
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
    this.recupererMajDansSaison();

    this.editionSaisonValidee.emit(this.saison);
  }

  /**
   * Masque le bloc d'édition et réaffiche le bloc de visualisation
   */
  annulerMiseAJourSaison() {
    this.editionDemandee = false;
  }

  /**
   * Réalise la conversion entre Saison et SaisonConvertie pour la MAJ en BDD
   */
  private recupererMajDansSaison() {
    this.saison.libelle = this.saisonConvertie.libelle;
    this.saison.dateDebut = Timestamp.fromDate(this.saisonConvertie.dateDebut);
    this.saison.dateFin = Timestamp.fromDate(this.saisonConvertie.dateFin);
  }

  /**
   * Réalise les contrôle sur le formulaire
   * @returns True ou False
   */
  formulaireValide(): boolean {
    return !!this.saisonConvertie?.libelle && !!this.saisonConvertie?.dateDebut && !!this.saisonConvertie?.dateFin && this.saisonConvertie.dateDebut <= this.saisonConvertie.dateFin;
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
    return this.listeSeancesPossiblePeriode.filter(seance => !seance.selectionne);
  }



  // toggleFiltre(jour: string) {
  //   // Vérifie si le jour est déjà dans la liste des filtres
  //   const index = this.listeSeancesPossiblePeriode.findIndex(seance => this.getNomJour(seance.date.getDay()) === jour);

  //   // Si le jour est déjà dans la liste des filtres, le supprimer
  //   if (index !== -1) {
  //     this.listeSeancesPossiblePeriode = this.listeSeancesPossiblePeriode.filter(seance => this.getNomJour(seance.date.getDay()) !== jour);
  //   } else {
  //     // Sinon, ajouter le jour à la liste des filtres
  //     const dateDuJour = new Date();
  //     dateDuJour.setHours(0, 0, 0, 0);
  //     dateDuJour.setDate(dateDuJour.getDate() + this.jourIndex(jour) - dateDuJour.getDay());
  //     const seancesDuJour = this.listeSeances.filter(seance => {
  //       const seanceDate = seance.date.toDate();
  //       return this.compareDates(seanceDate, dateDuJour);
  //     });
  //     this.listeSeancesPossiblePeriode.push(...seancesDuJour.map(seance => new SeancePossiblePeriode(seance.date.toDate(), seance)));
  //   }
  // }

  // jourIndex(jour: string): number {
  //   switch (jour.toLowerCase()) {
  //     case 'dimanche': return 0;
  //     case 'lundi': return 1;
  //     case 'mardi': return 2;
  //     case 'mercredi': return 3;
  //     case 'jeudi': return 4;
  //     case 'vendredi': return 5;
  //     case 'samedi': return 6;
  //     default: return -1;
  //   }
  // }

  // getNomJour(jour: number): string {
  //   switch (jour) {
  //     case 0: return 'dimanche';
  //     case 1: return 'lundi';
  //     case 2: return 'mardi';
  //     case 3: return 'mercredi';
  //     case 4: return 'jeudi';
  //     case 5: return 'vendredi';
  //     case 6: return 'samedi';
  //     default: return '';
  //   }
  // }
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