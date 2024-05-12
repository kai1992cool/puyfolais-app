import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SaisonService } from '../../../service/saison.service';
import { first, switchMap, of } from 'rxjs';


@Component({
  selector: 'app-saison-dialog',
  templateUrl: './saison-dialog.component.html',
  styleUrl: './saison-dialog.component.scss'
})
export class SaisonDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaisonDialogComponent>, 
    public saisonService: SaisonService,
  ) { }

  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur


  @ViewChild('saisonForm') saisonForm!: NgForm;

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;

      this.saisonService.verifierChevauchementSaison(formData.dateDebut, formData.dateFin)
        .pipe(
          first(), // Se désabonner après la première émission
          switchMap(chevauchement => {
            if (!chevauchement) {
              // Créer la saison
              return this.saisonService.creerSaison(formData.libelle, formData.dateDebut, formData.dateFin)
                .then(() => {
                  this.dialogRef.close();
                })
                .catch(error => {
                  console.error('Erreur lors de la création de la saison :', error);
                  // Gérer les erreurs éventuelles lors de la création de la saison
                });
            } else {
              this.afficherMessageErreur = true; // Affichez le message d'erreur
            }
            return of(null); // Renvoyer une valeur nulle pour terminer le flux observable
          })
        )
        .subscribe();
    }
  }
}
