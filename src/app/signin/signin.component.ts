import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../service/dialog.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  public username = '';
  public password = '';

  form: FormGroup;
  errorMessage: string = ''; // Propriété pour stocker le message d'erreur

  constructor(
    public dialogService: DialogService, 
    public angularFireAuth: AngularFireAuth, 
    private router: Router, private fb: FormBuilder, 
    private translateService: TranslateService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;

    this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        // L'utilisateur est connecté, rediriger vers AccueilComponent
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        // Handle Errors here.
        if (error.code === 'auth/invalid-credential') {
          this.errorMessage = this.translateService.instant('sign.identifiants.invalides');
        } else {
          this.errorMessage = error.message;
        }
      });
  }

  // Méthode pour envoyer un email de réinitialisation de mot de passe
  sendPasswordResetEmail(event: Event) {

    // Empêche la soumission du formulaire
    event.preventDefault();

    const email = this.form.value.email;

    this.angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        // Email de réinitialisation envoyé avec succès
        this.dialogService.openConfirmationDialog(this.translateService.instant('sign.emailEnvoye', { mail: email }), '/');
      })
      .catch((error) => {
        // Erreur lors de l'envoi de l'email de réinitialisation
        this.errorMessage = error.message;
      });
  }



  // Méthode appelée lors de la réussite de l'authentification
  // handleSignInSuccess() {
  //   this.router.navigate(['/']); // Redirection vers la page d'accueil
  // }
}
