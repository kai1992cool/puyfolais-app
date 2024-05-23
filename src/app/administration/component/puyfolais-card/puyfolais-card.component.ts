import { Component, Input } from '@angular/core';
import { Puyfolais } from '../../../model/puyfolais';
import { PuyfolaisService } from '../../../service/puyfolais.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialogComponent } from '../../../dialog/validation-dialog/validation-dialog.component';

@Component({
  selector: 'app-puyfolais-card',
  templateUrl: './puyfolais-card.component.html',
  styleUrl: './puyfolais-card.component.scss'
})
export class PuyfolaisCardComponent {

  @Input() puyfolais!: Puyfolais;

  constructor(
    public puyfolaisService: PuyfolaisService,
    private traductionService: TranslateService,
    private dialog: MatDialog
  ) { }

  /**
    * Ouvre la modale de confirmation de suppression du puyfolais
    * @param groupe Le puyfolais à supprimer
    */
  ouvrirConfirmationDialogPourSuppressionPuyfolais(puyfolais: Puyfolais): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      data: this.traductionService.instant('admin.puyfolais.confirmationSuppressionPuyfolais')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supprimerPuyfolais(puyfolais);
      }
    });
  }

  /**
   * Supprime le puyfolais
   * @param arg0 Le puyfolais à supprimer 
   */
  private supprimerPuyfolais(arg0: Puyfolais) {
    this.puyfolaisService.supprimerPuyfolais(arg0.uid).then(() => {
    })
  }

  transformLettreMaj(nom: string | undefined): string {
    if (nom) {
      return nom.toUpperCase();
    } else {
      return ''
    }
  }

  transformPremiereLettreMaj(prenom: string | undefined): string {
    if (prenom) {
      return prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    } else {
      return ''
    }
  }
}
