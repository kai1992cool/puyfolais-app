import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupeService } from '../../../service/groupe.service';
import { NgForm } from '@angular/forms';
import { Groupe } from '../../../model/groupe';

@Component({
  selector: 'app-groupe-dialog',
  templateUrl: './groupe-dialog.component.html',
  styleUrl: './groupe-dialog.component.scss'
})
export class GroupeDialogComponent {

  @ViewChild('groupeForm') groupeForm!: NgForm;

  referenceStructureParente: string = '';
  groupeAEditer: Groupe;
  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  constructor(
    public dialogRef: MatDialogRef<GroupeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public groupeService: GroupeService
  ) {
    this.groupeAEditer = data.groupeAEditer;
    this.referenceStructureParente = data.referenceStructureParente;
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupeForm.valid) {
      const operation = (this.groupeAEditer.uid !== '')
        ? this.updateGroupe()
        : this.createGroupe();

      operation
        .then(() => {
          this.dialogRef.close();
        })
        .catch(error => {
          console.error('Erreur lors de l\'opération sur le groupe :', error);
          // Gérer les erreurs éventuelles lors de l'opération sur le groupe
        });
    }
  }

  createGroupe(): Promise<void> {
    return this.groupeService.creerGroupe(
      this.groupeAEditer.nom!,
      this.groupeAEditer.numero!,
      this.referenceStructureParente
    ).then(() => {});  // Convert the Promise<DocumentReference<IGroupe>> to Promise<void>
  }

  updateGroupe(): Promise<void> {
    return this.groupeService.mettreAJourGroupe(this.groupeAEditer);
  }

}
