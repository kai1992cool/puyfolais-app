import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Puyfolais } from '../../../model/puyfolais';
import { PuyfolaisService } from '../../../service/puyfolais.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialogComponent } from '../../../dialog/validation-dialog/validation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-puyfolais-card',
  templateUrl: './puyfolais-card.component.html',
  styleUrls: ['./puyfolais-card.component.scss']
})
export class PuyfolaisCardComponent {

  @Input() puyfolais!: Puyfolais;
  @Output() emitSupprimerPuyfolais: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public puyfolaisService: PuyfolaisService,
    private traductionService: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) { }

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

  private supprimerPuyfolais(arg0: Puyfolais) {
    this.puyfolaisService.supprimerPuyfolais(arg0.uid).then(() => {
      this.emitSupprimerPuyfolais.emit();
    });
  }

  editerPuyfolais(arg0: Puyfolais) {
    this.router.navigateByUrl('/admin/puyfolais/edit', {
      state: { puyfolais: this.puyfolais }
    });
  }

  isMineur(dateNaissance?: Date): boolean {
    if (dateNaissance) {
      const aujourdHui = new Date();
      const anneeNaissance = dateNaissance.getFullYear();
      const age = aujourdHui.getFullYear() - anneeNaissance;
      return age < 18;
    } else {
      return false;
    }
  }
}
