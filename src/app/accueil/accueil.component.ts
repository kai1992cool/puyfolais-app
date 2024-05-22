import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from 'rxjs';
import { UtilisateurService } from './../service/utilisateur.service';
import { Profil } from '../enum/profil';
import { FakeService } from '../service/fake.service';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent implements OnInit {

  constructor(
    public authentificationFirebaseAngular: AngularFireAuth,
    public utilisateurService: UtilisateurService,
    public fakeService: FakeService
  ) {}

  userFirebase: firebase.default.User | null = null;
  userPermissions:  Observable<string[]> | null = null;
  utilisateurEstAdmin: boolean = false;

  ngOnInit() {
    this.utilisateurService.possedePermission(Profil.Administrateur)
    .subscribe(hasPermission => this.utilisateurEstAdmin = hasPermission); 
  };
}
