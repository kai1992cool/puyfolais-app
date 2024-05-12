import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IUtilisateur } from '../interface/utilisateur';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class LangueService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilisateurService: UtilisateurService
  ) {}

  // Fonction pour sauvegarder la langue préférée de l'utilisateur
  enregisterPreferenceUtilisateur(language: string): void {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.utilisateurService.mettreAJourLangueUtilisateur(user.uid, language)
      }
    });
  }

  // Fonction pour récupérer la langue préférée de l'utilisateur
  recupererPreferenceUtilisateur(): Observable<string | null> {
    return new Observable(observer => {
      this.afAuth.onAuthStateChanged(user => {
        if (user) {
          this.utilisateurService.recupererUtilisaeur(user.uid)
            .subscribe(snapshot => {
              const data = snapshot.data() as IUtilisateur;
              const languagePreference = data ? data.langue : null;
              observer.next(languagePreference);
            });
        } else {
          observer.next(null);
        }
      });
    });
  }
}
