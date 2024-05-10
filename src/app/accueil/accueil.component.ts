import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable, filter } from 'rxjs';
import { UtilisateurService } from './../service/utilisateur.service';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent implements OnInit {

  constructor(
    public angularFireAuth: AngularFireAuth,
    public utilisateurService: UtilisateurService
  ) {}

  userFirebase: firebase.default.User | null = null;
  userPermissions:  Observable<string[]> | null = null;
  isAdmin: boolean = false;


  ngOnInit() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userPermissions = this.utilisateurService.recupererPermissionsUtilisateur(user.uid);
  
        // Vérifier si la valeur "ADMIN" est présente dans le tableau des permissions
        this.userPermissions.pipe(
          filter(permissions => permissions.includes('ADM'))
        ).subscribe(permissions => {
          if (permissions.includes('ADM')) {
            this.isAdmin = true;
          } 
        });
      } 
    });
  }
}
