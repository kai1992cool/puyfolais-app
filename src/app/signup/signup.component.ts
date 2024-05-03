import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  form: FormGroup;
  errorMessage: string = ''; // Propriété pour stocker le message d'erreur

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private fb: FormBuilder, private db: AngularFirestore) {
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

    console.log(" nom : " + nom);

    // Vérifier si un utilisateur avec cet e-mail existe déjà
    this.db.collection('utilisateurs', ref => ref.where('email', '==', email)).valueChanges().pipe(
      take(1), // Prend seulement le premier résultat pour vérifier si l'e-mail existe
      switchMap((users) => {
        if (users && users.length > 0) {
          // Un utilisateur avec cet e-mail existe déjà
          this.errorMessage = 'Un utilisateur avec cet e-mail existe déjà.';
          return [];
        } else {
          // Aucun utilisateur avec cet e-mail n'a été trouvé, procéder à l'inscription
          return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
        }
      }),
      switchMap((result) => {
        if (!result) {
          // Utilisateur non créé (peut arriver si l'e-mail existe déjà)
          return [];
        }
        // Utilisateur créé avec succès, insérer les informations dans Firestore
        const userId = result.user?.uid;
        return this.db.collection('utilisateurs').doc(userId).set({ email: email, nom: nom, prenom: prenom })
        .then(() => {
          // L'insertion des données dans Firestore est réussie, rediriger vers /accueil
          this.router.navigateByUrl('/');
        });
      })
    ).subscribe({
      error: (error) => {
        // Gestion des erreurs
        this.errorMessage = error.message;
      }
    });
  }

}
