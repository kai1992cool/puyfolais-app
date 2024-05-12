import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';
import { UtilisateurService } from './service/utilisateur.service';
import { Profil } from './enum/profil';
import { Router } from "@angular/router";
import { LangueService } from './service/langue.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';


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
    public router: Router,
    private langueService: LangueService,
    private analytics: AngularFireAnalytics ) { }

  ngOnInit() {
    this.utilisateurService.possedePermission(Profil.Administrateur)
      .subscribe(hasPermission => this.utilisateurEstAdmin = hasPermission);

      this.langueService.recupererPreferenceUtilisateur().subscribe(language => {
        if (language) {
          this.traductionService.use(language);
        } else {
          this.traductionService.use('fr-FR');
        }});
  }

  deconnexionFirebase() {
    this.authentificationFirebaseAngular.signOut();
    this.router.navigateByUrl('/');
  }

  public changerLangue(language: string): void {
    this.traductionService.use(language);
    this.langueService.enregisterPreferenceUtilisateur(language);
  }

}
