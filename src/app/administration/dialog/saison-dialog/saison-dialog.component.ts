import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaisonService } from '../../../service/saison.service';
import { first, switchMap, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { Saison } from '../../../model/saison';

@Component({
  selector: 'app-saison-dialog',
  templateUrl: './saison-dialog.component.html',
  styleUrl: './saison-dialog.component.scss'
})
export class SaisonDialogComponent implements OnInit {

  @ViewChild('saisonForm') saisonForm!: NgForm;

  saisonAEditer: Saison;
  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  constructor(
    public dialogRef: MatDialogRef<SaisonDialogComponent>,
    public saisonService: SaisonService,
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.saisonAEditer = data.saisonAEditer;
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.traductionService.currentLang);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;

      if (formData.dateDebut <= formData.dateFin) {
        if (this.saisonAEditer.uid === '') {
          // Créer la saison
          this.saisonService.creerSaison(formData.libelle, formData.dateDebut, formData.dateFin)
            .then(() => {
              this.dialogRef.close();
            })
            .catch(error => {
              console.error('Erreur lors de la création de la saison :', error);
              // Gérer les erreurs éventuelles lors de la création de la saison
            });
        } else {
          // Met à jour la saison
          this.saisonService.mettreAJourSaison(this.saisonAEditer)
            .then(() => {
              this.dialogRef.close();
            })
            .catch(error => {
              console.error('Erreur lors de la création de la saison :', error);
              // Gérer les erreurs éventuelles lors de la création de la saison
            });
        }

      } else {
        this.messageErreur = this.traductionService.instant('admin.saisons.edition.messageDatesErronees');
        this.afficherMessageErreur = true; // Affichez le message d'erreur
      }
    }
  }

  creerSaison(): Promise<void> {
    return this.saisonService.creerSaison(
      this.saisonAEditer.libelle!,
      this.saisonAEditer.dateDebut!,
      this.saisonAEditer.dateFin!,
    ).then(() => { });  // Convert the Promise<DocumentReference<ISaison>> to Promise<void>
  }

  mettreAJourSaison(): Promise<void> {
    return this.saisonService.mettreAJourSaison(this.saisonAEditer);
  }
}
