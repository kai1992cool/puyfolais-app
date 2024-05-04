import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  errorMessage: string = ''; // Propriété pour stocker le message d'erreur

  constructor(public angularFireAuth: AngularFireAuth, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  ngOnInit(): void {

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
          this.errorMessage = 'Les identifiants fournis sont invalides. Veuillez réssayer.'
        } else {
          this.errorMessage = error.message; 
        }
      });
  }

  // Méthode appelée lors de la réussite de l'authentification
  // handleSignInSuccess() {
  //   this.router.navigate(['/']); // Redirection vers la page d'accueil
  // }
}
