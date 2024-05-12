import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SaisonService } from '../../../service/saison.service';
import { first, switchMap, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-saison-dialog',
  templateUrl: './saison-dialog.component.html',
  styleUrl: './saison-dialog.component.scss'
})
export class SaisonDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SaisonDialogComponent>,
    public saisonService: SaisonService,
    private traductionService: TranslateService,
    private dateAdapter: DateAdapter<any>,
  ) { }

  afficherMessageErreur: boolean = false; // Variable pour contrôler l'affichage du message d'erreur
  messageErreur: string = ''; // Contenu du message d'erreur

  @ViewChild('saisonForm') saisonForm!: NgForm;

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.traductionService.currentLang);
  }

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
              if (formData.dateDebut <= formData.dateFin) {
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
                this.messageErreur = this.traductionService.instant('admin.saisons.edition.messageDatesErronees');
                this.afficherMessageErreur = true; // Affichez le message d'erreur
              }
            } else {
              this.messageErreur = this.traductionService.instant('admin.saisons.edition.messageChevauchement');
              this.afficherMessageErreur = true; // Affichez le message d'erreur
            }
            return of(null); // Renvoyer une valeur nulle pour terminer le flux observable
          })
        )
        .subscribe();
    }
  }
}
