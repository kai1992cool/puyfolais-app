import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StructureService } from '../../../service/structure.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { TypeStructure } from '../../../enum/type-structures';
import { EnumTraductionService } from '../../../service/enum-traduction.service';

@Component({
  selector: 'app-structure-dialog',
  templateUrl: './structure-dialog.component.html',
  styleUrl: './structure-dialog.component.scss'
})
export class StructureDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StructureDialogComponent>,
    public structureService: StructureService,
    public traductionEnumService: EnumTraductionService
  ) { }

  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  listeTypesStructures = Object.values(TypeStructure); // Create a list of enum values
  typeStructureSelectionnee!: TypeStructure;

  @ViewChild('structureForm') structureForm!: NgForm;

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;

      this.structureService.creerStructure(formData.libelle, formData.typeStructure)
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
