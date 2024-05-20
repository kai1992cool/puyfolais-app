import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { GroupeService } from '../../../service/groupe.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-groupe-dialog',
  templateUrl: './groupe-dialog.component.html',
  styleUrl: './groupe-dialog.component.scss'
})
export class GroupeDialogComponent {

  referenceStructureParente: string = '';

  constructor(
    public dialogRef: MatDialogRef<GroupeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public groupeService: GroupeService
  ) {
    this.referenceStructureParente = data.referenceStructureParente;
   }

  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  @ViewChild('groupeForm') groupeForm!: NgForm;

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;

      this.groupeService.creerGroupe(formData.libelle, formData.numero, this.referenceStructureParente)
        .then(() => {
          this.dialogRef.close();
        })
        .catch(error => {
          console.error('Erreur lors de la création de la structure :', error);
          // Gérer les erreurs éventuelles lors de la création de la saison
        });
    }
  }

}
