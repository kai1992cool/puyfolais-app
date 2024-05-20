import { Component, Input } from '@angular/core';
import { Structure } from '../../../model/structure';
import { StructureService } from '../../../service/structure.service';
import { TranslateService } from '@ngx-translate/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { TypeStructure } from '../../../enum/type-structures';
import { GroupeService } from '../../../service/groupe.service';
import { Groupe } from '../../../model/groupe';
import { GroupeDialogComponent } from '../../dialog/groupe-dialog/groupe-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialogComponent } from '../../../dialog/validation-dialog/validation-dialog.component';
import { StructureDialogComponent } from '../../dialog/structure-dialog/structure-dialog.component';

@Component({
  selector: 'app-structure-card',
  templateUrl: './structure-card.component.html',
  styleUrl: './structure-card.component.scss'
})
export class StructureCardComponent {

  @Input() structure!: Structure;

  editionDemandee: boolean = false;
  suppressionStructureImpossible: boolean = false; // A implémenter si besoin (méthode verifierPossibiliteSupprimerStructure )
  errorEdit: boolean = false;
  errorEditMessage: string = '';
  listeTypesStructures = Object.values(TypeStructure); // Create a list of enum values
  demandeAffichageListeGroupes: boolean = false;
  listeGroupeStructure: Groupe[] = [];

  constructor(
    public structureService: StructureService,
    public groupeService: GroupeService,
    private traductionService: TranslateService,
    public traductionEnumService: EnumTraductionService,
    private dialog: MatDialog
  ) { }

 /**
  * Ouvre la modale de confirmation de suppression du groupe
  * @param groupe Le groupe à supprimer
  */
  ouvrirConfirmationDialogPourSuppressionStructure(structure: Structure): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      data: this.traductionService.instant('admin.structures.confirmationSuppressionStructure')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supprimerStructure(structure);
      }
    });
  }

  /**
   * Supprime la structure
   * @param arg0 La structure à supprimer 
   */
  private supprimerStructure(arg0: Structure) {
    if (!this.suppressionStructureImpossible) {
      this.structureService.supprimerStructure(arg0.uid).then(() => {
      })
    }
  }

  /**
  * Ouvre la modale de modification d'une structure
  */
  editerStructure(structure: Structure) {
    const dialogAjoutGroupe = this.dialog.open(StructureDialogComponent, {
      width: '400px',
      data: { structureAEditer: structure }
    });

    dialogAjoutGroupe.afterClosed().subscribe(() => {
      
    });
  }

  /**
 * Traduit le message à afficher en cas d'impossibilité de suppression
 * @returns Le message traduit
 */
  recupererMessagesuppressionStructureImpossible(): string {
    return this.suppressionStructureImpossible ? this.traductionService.instant('admin.structures.blocageSuppression') : '';
  }

  /**
   * Valide la mise à jour en BDD
   */
  validerMiseAJourStructure() {
    this.structureService.mettreAJourStructure(this.structure).then(() => {
      this.editionDemandee = false;
    })
  }

  /**
   * Masque le bloc d'édition et réaffiche le bloc de visualisation
   */
  annulerMiseAJourStructure() {
    this.editionDemandee = false;
  }

  /**
   * Réalise les contrôle sur le formulaire
   * @returns True ou False
   */
  formulaireValide(): boolean {

    this.errorEdit = false;

    if (!this.structure?.nom) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champNomObligatoire');
    }


    if (!this.structure?.type) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champTypeObligatoire');
    }

    return !this.errorEdit
  }

  /**
   * Active le bloc de gestion des listes de groupes (ou l'annule si nouveau clic)
   */
  parametrerStructure() {
    if (this.demandeAffichageListeGroupes) {
      this.demandeAffichageListeGroupes = false
    } else {
      this.demandeAffichageListeGroupes = true;
      this.recupererGroupesExistants();
    }
  }


  // Edition des groupes
  //********************

  /**
   * Récupère en BDD la liste des grupes
   */
  private recupererGroupesExistants() {
    this.groupeService.recupererGroupesParUidStructure(this.structure.uid).subscribe(groups => {
      this.listeGroupeStructure = groups
    })
  }

  voirFicheGroupe(arg0: Groupe) {
    console.log("Accès groupe " + arg0.nom + ' / ' + arg0.uid)
  }

  /**
   * Ouvre la modale d'ajout d'un groupe
   */
  ajouterGroupe() {
    const newGroupe: Groupe = { uid: '' }
    const dialogAjoutGroupe = this.dialog.open(GroupeDialogComponent, {
      width: '400px',
      data: { referenceStructureParente: this.structure.uid, groupeAEditer: newGroupe }
    });

    dialogAjoutGroupe.afterClosed().subscribe(() => {
      this.recupererGroupesExistants();
    });
  }

  /**
   * Ouvre la modale de confirmation de suppression du groupe
   * @param groupe Le groupe à supprimer
   */
  ouvrirConfirmationDialogPourSuppressionGroupe(groupe: Groupe): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      data: this.traductionService.instant('admin.groupes.confirmationSuppressionGroupe')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supprimerGroupe(groupe);
      }
    });
  }

  /**
  * Supprime du groupe
  * @param arg0 Le groupe à supprimer 
  */
  private supprimerGroupe(arg0: Groupe) {
    this.groupeService.supprimerGroupe(arg0.uid).then(() => {
      this.recupererGroupesExistants();
    })
  }

  /**
  * Ouvre la modale de modification d'un groupe
  */
  editerGroupe(groupe: Groupe) {
    const dialogAjoutGroupe = this.dialog.open(GroupeDialogComponent, {
      width: '400px',
      data: { referenceStructureParente: this.structure.uid, groupeAEditer: groupe }
    });

    dialogAjoutGroupe.afterClosed().subscribe(() => {
      this.recupererGroupesExistants();
    });
  }
}
