import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private angularFireAuth: AngularFireAuth,
    private fb: FormBuilder,
    private db: AngularFirestore,
    public dialogService: DialogService,
    private translateService: TranslateService
  ) {
    this.form = this.fb.group({
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
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
      // Définition du nom d'affichage de l'utilisateur
      return result.user?.updateProfile({
        displayName: nom + ' ' + prenom // Concaténez nom et prénom pour obtenir le nom d'affichage
      }).then(() => {
        // Enregistrement des autres informations de l'utilisateur dans Firestore
        return this.db.collection('utilisateurs').doc(userId).set({ email: email, nom: nom, prenom: prenom })
          .then(() => {
            this.dialogService.openConfirmationDialog(this.translateService.instant('sign.validationInscription'),'/');
          });
      });
    })
      .catch((error) => {
        // Handle Errors here.
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = this.translateService.instant('sign.identifiants.existants');
        } else {
          this.errorMessage = error.message; 
        }
      });
  }
}
