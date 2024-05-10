import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';
import { UtilisateurService } from './service/utilisateur.service';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'puyfolais-app';
  userFirebase: firebase.default.User | null = null;
  userPermissions: Observable<string[]> | null = null;
  isAdmin: boolean = false;


  constructor(
    public utilisateurService: UtilisateurService,
    public translateService: TranslateService,
    public angularFireAuth: AngularFireAuth) { }

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

  logOut() {
    this.isAdmin = false;
    this.userPermissions = null;
    this.angularFireAuth.signOut();
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }
}
