import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Puyfolais } from '../../model/puyfolais';
import { PuyfolaisService } from '../../service/puyfolais.service';
import { Subscription } from 'rxjs';
import { FilterPipe } from '../pipe/filter.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-puyfolais',
  templateUrl: './admin-puyfolais.component.html',
  styleUrl: './admin-puyfolais.component.scss'
})
export class AdminPuyfolaisComponent {

  constructor(
    private dialog: MatDialog,
    public traductionService: TranslateService
    ) { }

  listePuyfolais: Puyfolais[] = [];
  puyfolaisSubscription: Subscription | undefined; // Garder une référence à l'abonnement pour pouvoir s'en désabonner
  puyfolaisService = inject(PuyfolaisService);
  filtreRecherche: string = '';

  ngOnInit() {
    this.mettreAJourListePuyfolais();
  }

  mettreAJourListePuyfolais() {
    // Se désabonner de l'observable précédent s'il existe
    if (this.puyfolaisSubscription) {
      this.puyfolaisSubscription.unsubscribe();
    }

    // Souscrire à un nouvel observable
    this.puyfolaisSubscription = this.puyfolaisService.recupererPuyfolais().subscribe(puyfolais => {
      this.listePuyfolais = puyfolais.sort((a, b) => a.nom!.localeCompare(b.nom!));
    });
  }

  // ouvrirModalAjoutStructure(): void {
  //   this.structureSelectionnee = null;
  //   const newStructure: Structure = { uid: '' }
  //   const dialogAjoutSaison = this.dialog.open(StructureDialogComponent, {
  //     width: '400px',
  //     data: { structureAEditer: newStructure }
  //   });

  //   dialogAjoutSaison.afterClosed().subscribe(() => {
  //     this.mettreAJourListeStructure();
  //   });

  // }

}
