import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StructureService } from '../../../service/structure.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { TypeStructure } from '../../../enum/type-structures';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { Structure } from '../../../model/structure';

@Component({
  selector: 'app-structure-dialog',
  templateUrl: './structure-dialog.component.html',
  styleUrl: './structure-dialog.component.scss'
})
export class StructureDialogComponent {

  @ViewChild('structureForm') structureForm!: NgForm;

  structureAEditer: Structure;
  listeTypesStructures = Object.values(TypeStructure); // Create a list of enum values
  typeStructureSelectionnee!: TypeStructure;
  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  constructor(
    public dialogRef: MatDialogRef<StructureDialogComponent>,
    public structureService: StructureService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public traductionEnumService: EnumTraductionService
  ) { 
    this.structureAEditer = data.structureAEditer;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.structureForm.valid) {
      const operation = (this.structureAEditer.uid !== '')
        ? this.mettreAJourStructure()
        : this.creerStructure();

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

  creerStructure(): Promise<void> {
    return this.structureService.creerStructure(
      this.structureAEditer.nom!,
      this.structureAEditer.type!
    ).then(() => {});  // Convert the Promise<DocumentReference<IStructure>> to Promise<void>
  }

  mettreAJourStructure(): Promise<void> {
    return this.structureService.mettreAJourStructure(this.structureAEditer);
  }
}
