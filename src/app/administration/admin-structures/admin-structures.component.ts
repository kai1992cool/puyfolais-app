import { Component, OnInit, inject } from '@angular/core';
import { Structure } from '../../model/structure';
import { Subscription } from 'rxjs';
import { StructureService } from '../../service/structure.service';
import { IStructure } from '../../interface/structure';
import { MatDialog } from '@angular/material/dialog';
import { StructureDialogComponent } from '../dialog/structure-dialog/structure-dialog.component';

@Component({
  selector: 'app-admin-structures',
  templateUrl: './admin-structures.component.html',
  styleUrl: './admin-structures.component.scss'
})
export class AdminStructuresComponent implements OnInit {

  constructor(private dialog: MatDialog) { }


  listeToutesStructure: Structure[] = [];
  strutureSubscription: Subscription | undefined; // Garder une référence à l'abonnement pour pouvoir s'en désabonner
  structureService = inject(StructureService);
  structureSelectionnee: IStructure | null = null;

  ngOnInit() {
    this.mettreAJourListeStructure();
  }

  mettreAJourListeStructure() {
    // Se désabonner de l'observable précédent s'il existe
    if (this.strutureSubscription) {
      this.strutureSubscription.unsubscribe();
    }

    // Souscrire à un nouvel observable
    this.strutureSubscription = this.structureService.recupererStructure().subscribe(structures => {
      this.listeToutesStructure = structures.sort((a, b) => a.nom!.localeCompare(b.nom!));
    });
  }

  ouvrirModalAjoutStructure(): void {
    this.structureSelectionnee = null;
    const newStructure: Structure = { uid: '' }
    const dialogAjoutSaison = this.dialog.open(StructureDialogComponent, {
      width: '400px',
      data: { structureAEditer: newStructure }
    });

    dialogAjoutSaison.afterClosed().subscribe(() => {
      this.mettreAJourListeStructure();
    });

  }
}
