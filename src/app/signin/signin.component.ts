import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  constructor(private router: Router) {}

  // Méthode appelée lors de la réussite de l'authentification
  handleSignInSuccess() {
    this.router.navigate(['/']); // Redirection vers la page d'accueil
  }
}
