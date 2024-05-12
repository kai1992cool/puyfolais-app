import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SaisonService } from '../../service/saison.service';
import { ISaison } from '../../interface/saison';
import { MatDialog } from '@angular/material/dialog';
import { SaisonDialogComponent } from '../dialog/saison-dialog/saison-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-saisons',
  templateUrl: './admin-saisons.component.html',
  styleUrl: './admin-saisons.component.scss'
})
export class AdminSaisonsComponent implements OnInit, OnDestroy  {

  constructor(private dialog: MatDialog, private firestore: AngularFirestore) { }

  listeToutesSaisons: ISaison[] = [];
  saisonService = inject(SaisonService);
  editionSaisonActivee: boolean = false;
  saisonSelectionnee: ISaison | null = null;
  saisonSubscription: Subscription | undefined ; // Garder une référence à l'abonnement pour pouvoir s'en désabonner

  ngOnInit() {
    this.mettreAJourListeSaison();
  }

  ouvrirModalAjoutSaison(): void {
    this.saisonSelectionnee = null;
    const dialogAjoutSaison = this.dialog.open(SaisonDialogComponent, {
      width: '400px',
    });

    dialogAjoutSaison.afterClosed().subscribe(() => {
      this.mettreAJourListeSaison();
    });

  }

  mettreAJourListeSaison() {
    // Se désabonner de l'observable précédent s'il existe
    if (this.saisonSubscription) {
      this.saisonSubscription.unsubscribe();
    }

    // Souscrire à un nouvel observable
    this.saisonSubscription = this.saisonService.recupererSaisons().subscribe(saisons => {
      this.listeToutesSaisons = saisons;
    });
  }

  validerModificationSaison(saison: ISaison) {
    this.firestore.collection('saisons').doc(saison.uid).update(saison).catch(error => {
      // Gérer les erreurs
      console.error("Erreur lors de la mise à jour de la saison :", error);
    });
    this.mettreAJourListeSaison();
    this.saisonSelectionnee = null;

  }

  afficherBlocEditionSaison(saison: ISaison) {
    this.saisonSelectionnee = saison;
  }

  annulerEditionSaison() {
    this.saisonSelectionnee = null;
  }

  ngOnDestroy() {
    // Se désabonner de l'observable lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.saisonSubscription) {
      this.saisonSubscription.unsubscribe();
    }
  }
}
