import { Component, Input } from '@angular/core';
import { Structure } from '../../../model/structure';
import { StructureService } from '../../../service/structure.service';
import { TranslateService } from '@ngx-translate/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { TypeStructure } from '../../../enum/type-structures';

@Component({
  selector: 'app-structure-card',
  templateUrl: './structure-card.component.html',
  styleUrl: './structure-card.component.scss'
})
export class StructureCardComponent {
  @Input() structure!: Structure;

  editionDemandee: boolean = false;
  suppressionImpossible: boolean = false ; // A implémenter si besoin (méthode verifierPossibiliteSupprimerStructure )
  errorEdit: boolean = false;
  errorEditMessage: string = '';
  listeTypesStructures = Object.values(TypeStructure); // Create a list of enum values

  
  constructor(
    public structureService: StructureService,
    private traductionService: TranslateService,
    public traductionEnumService: EnumTraductionService
  ) { }

  /**
 * Supprime la saison
 * @param arg0 La structure à supprimer 
 */
  supprimerStructure(arg0: Structure) {
    if (!this.suppressionImpossible) {
      this.structureService.supprimerStructure(arg0.uid).then(() => {
      })
    }
  }

  /**
* Active le bloc d'édition d'une structure (et désative le bloc de visualisation)
*/
  editerStructure() {
    this.editionDemandee = true;
  }

  /**
 * Traduit le message à afficher en cas d'impossibilité de suppression
 * @returns Le message traduit
 */
  recupererMessageSuppressionImpossible(): string {
    return this.suppressionImpossible ? this.traductionService.instant('admin.structures.blocageSuppression') : '';
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
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champLibelleObligatoire');
    }

    
    if (!this.structure?.type) {
      this.errorEdit = true;
      this.errorEditMessage = this.traductionService.instant('admin.saisons.edition.champTypeObligatoire');
    }

    return !this.errorEdit
  }
}
