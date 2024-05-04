import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nom: [],
      prenom: [],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const { nom, prenom, email, password } = this.form.value;

    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const userId = result.user?.uid;
        return this.db.collection('utilisateurs').doc(userId).set({ email: email, nom: nom, prenom: prenom })
          .then(() => {
            this.openConfirmationDialog();
          });
      })
      .catch((error) => {
        // Handle Errors here.
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = "Cette adresse est déjà utilisée, merci d'utiliser vos identifiants associés pour vous connecter."
        } else {
          this.errorMessage = error.message; 
        }
      });
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: "Votre inscription a été réalisée avec succès ! Vous êtes maintenant connecté. Toutefois, aucun profil ne vous a été affecté pour le moment. Veuillez attendre qu'un administrateur vous affecte ces profils pour utiliser l'application."
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
