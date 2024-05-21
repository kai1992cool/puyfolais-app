import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EtatSaison } from '../../../enum/etat-saison';
import { SaisonService } from '../../../service/saison.service';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { SeanceService } from '../../../service/seance.service';
import { Saison } from '../../../model/saison';
import { Seance } from '../../../model/seance';
import { TypeSeance } from '../../../enum/type-seances';
import { ISeance } from '../../../interface/seance';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { ValidationDialogComponent } from '../../../dialog/validation-dialog/validation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SaisonDialogComponent } from '../../dialog/saison-dialog/saison-dialog.component';


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
  planningDemande: boolean = false;
  listeJoursFiltresActifs: number[] = this.FILTRE_JOURS_VEN_SAM.slice();;
  listeMoisFiltresActifs: number[] = this.FILTRE_MOIS_TOUS.slice();;
  listeSeances: Seance[] = [];
  errorEdit: boolean = false;
  errorEditMessage: string = '';
  
  constructor(
    public saisonService: SaisonService,
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    private seanceService: SeanceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.traductionService.currentLang);
    this.detecterTexteEtCouleurBadgeSaison();
    this.verifierPossibiliteSupprimerSaison(this.saison);
    this.recupererSeancesExistantes();
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
  * Ouvre la modale de confirmation de suppression du groupe
  * @param groupe Le groupe à supprimer
  */
   ouvrirConfirmationDialogPourSuppressionSaison(saison: Saison): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      data: this.traductionService.instant('admin.saisons.confirmationSuppressionSaison')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supprimerSaison(saison);
      }
    });
  }

  /**
   * Supprime la saison
   * @param arg0 La saison à supprimer
   */
  private supprimerSaison(arg0: Saison) {
    if (!this.suppressionImpossible) {
      this.saisonService.supprimerSaison(arg0).then(() => {
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
  * Ouvre la modale de modification d'une saison
  */
  editerSaison(saison: Saison) {
    const dialogAjoutGroupe = this.dialog.open(SaisonDialogComponent, {
      width: '400px',
      data: { saisonAEditer: saison }
    });

    dialogAjoutGroupe.afterClosed().subscribe(() => {
      
    });
  }

  /**
   * Réalise les contrôle sur le formulaire
   * @returns True ou False
   */
  formulaireValide(): boolean {

    const dateMaxEtMin = this.trouverMinEtMaxDates(this.listeSeances);
    this.errorEdit = false;

    if (!this.saison?.libelle) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champLibelleObligatoire');
    }

    if (!this.saison?.dateDebut) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champDateDebutObligatoire');
    }

    if (!this.saison?.dateFin) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champDateFinObligatoire');
    }

    if (!(this.saison.dateDebut! <= this.saison.dateFin!)) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.messageDatesErronees');
    }

    if (dateMaxEtMin.dateMin) {
      if (!(this.saison.dateDebut! <= dateMaxEtMin.dateMin)) {
        this.errorEdit = true;
        this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.messageModificationPlageAvecSeanceExistantes');
      }
    }
    if (dateMaxEtMin.dateMax) {
      if (!(this.saison.dateFin! >= dateMaxEtMin.dateMax)) {
        this.errorEdit = true;
        this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.messageModificationPlageAvecSeanceExistantes');
      }
    }

    return !this.errorEdit
  }


  // Edition des séances
  //********************

  /**
   * Active le bloc de gestion du planning (ou l'annule si nouveau clic)
   */
  editerPlanningSaison() {
    if (this.planningDemande) {
      this.planningDemande = false
      this.recupererSeancesExistantes();
    } else {
      this.planningDemande = true;
    }
  }

  /**
   * Ce code récupère pour la saison chaque séance dans la collection firestore pour ensuite etre
   * rapproché avec les jours de la période
   */
  private recupererSeancesExistantes(): void {
    this.listeSeances = [];
    this.seanceService.recupererListeSeance(this.saison.seances!)
      .subscribe(listeSeancesBdd => {

        listeSeancesBdd.forEach(seanceBdd => {
          this.listeSeances.push(seanceBdd)
          this.listeSeances.sort((a, b) => a.date.getTime() - b.date.getTime());
        })
      })
  }

  /**
   * Gestion de la sélection d'une date dans le calendrier. Si la date n'existe pas, on initialise une séance
   * sinon, on la duplique
   * @param selectedDate La date sélectionnée
   */
  selectionDateSeanceCalendrier(selectedDate: Date) {
    const seancesADate = this.listeSeances.filter(seance => seance.seanceADate(selectedDate))
    const nouvelleSeance = new Seance('', selectedDate, TypeSeance.NOR)

    // Dans le cas d'une création, on applique une heure par défaut à la nouvelle séance.
    if (seancesADate.length === 0) {
      // TODO : implémenter le paramétrage de l'heure de début de séance
      nouvelleSeance.date.setHours(21)
    }
    this.listeSeances.push(nouvelleSeance)
    this.listeSeances.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Réalise la mise à jour de la BDD firestore une fois toutes les opérations de créations, modifications,
   * suppressions réalisés en vu de mettre à jour la liste de séances dans l'objet saison
   */
  validerMiseAJourSeances() {
    const listDocCreePromise = this.seanceService.creerListeSeances(this.listeSeances.filter(seanceACreer => seanceACreer.uid === ''));
    const listDocMajPromise = this.seanceService.majListeSeances(this.listeSeances.filter(seanceACreer => seanceACreer.miseAJour && seanceACreer.uid !== ''));
    const listDocNonImpacteesPromise = this.seanceService.listeSeancesNonImpactees(this.listeSeances.filter(seanceNonImpactees => (!seanceNonImpactees.miseAJour) && seanceNonImpactees.uid !== '' && !seanceNonImpactees.supprimee));
    const listDocSupprimesPromise = this.seanceService.supprimerListeSeances(this.listeSeances.filter(seanceACreer => seanceACreer.supprimee));

    Promise.all([listDocCreePromise, listDocMajPromise, listDocNonImpacteesPromise, listDocSupprimesPromise])
      .then(results => {
        const toutesReferencesSeancesAMaj: DocumentReference<ISeance>[] = [];
        results.forEach(result => {
          if (Array.isArray(result)) {
            toutesReferencesSeancesAMaj.push(...result);
          }
        });
        // Mettre à jour l'enregistrement avec les DocumentReference
        return this.saisonService.mettreAjourListeLienSeances(this.saison.uid, toutesReferencesSeancesAMaj);
      })
      .then(() => {
        console.debug("DocumentReference insérées avec succès dans l'enregistrement de la saison");
      })
      .catch(error => {
        console.error("Une erreur est survenue lors de l'insertion des DocumentReference :", error);
      });
  }

  /**
   * Permet la suppression dans le tableau des séances d'un item qui a été créé (sans uid) puis supprimée
   * @param seance La séance sans uid à supprimer
   */
  retirerSeanceSansUid(seance: Seance) {
    const indexSeancesNouvelleASupprimer = this.listeSeances.findIndex(seanceTrouvee => seanceTrouvee.seanceADate(seance.date));

    if (indexSeancesNouvelleASupprimer !== -1) {
      this.listeSeances.splice(indexSeancesNouvelleASupprimer, 1);
    }
  }

  private trouverMinEtMaxDates(tableau: Seance[]) {
    if (tableau.length === 0) {
      return { dateMin: null, dateMax: null };
    }

    // Convertir les dates en timestamps pour comparaison
    const dates = tableau.map(obj => new Date(obj.date).setHours(0, 0, 0, 0));

    // Trouver le timestamp minimal et maximal
    const minTimestamp = Math.min(...dates);
    const maxTimestamp = Math.max(...dates);

    // Convertir les timestamps en objets Date
    return {
      dateMin: new Date(minTimestamp),
      dateMax: new Date(maxTimestamp)
    };
  }
}

