import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';
import { UtilisateurService } from './service/utilisateur.service';
import { Profil } from './enum/profil';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'puyfolais-app';

  utilisateurEstAdmin: boolean = false;

  constructor(
    public traductionService: TranslateService,
    public utilisateurService: UtilisateurService,
    public authentificationFirebaseAngular: AngularFireAuth,
    public router: Router ) { }

  ngOnInit() {
    this.utilisateurService.possedePermission(Profil.Administrateur)
      .subscribe(hasPermission => this.utilisateurEstAdmin = hasPermission);
  }

  deconnexionFirebase() {
    this.authentificationFirebaseAngular.signOut();
    this.router.navigateByUrl('/');
  }

  public changerLangue(language: string): void {
    this.traductionService.use(language);
  }

}
