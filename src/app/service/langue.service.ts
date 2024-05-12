import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IUtilisateur } from '../interface/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class LangueService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  // Fonction pour sauvegarder la langue préférée de l'utilisateur
  enregisterPreferenceUtilisateur(language: string): void {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.firestore.collection('utilisateurs').doc(user.uid).update({
          langue: language
        }).catch(error => {
          // Gérer les erreurs
          console.error("Erreur lors de la mise à jour de la langue de l'utilisateur :", error);
        });
      }
    });
  }

  // Fonction pour récupérer la langue préférée de l'utilisateur
  recupererPreferenceUtilisateur(): Observable<string | null> {
    return new Observable(observer => {
      this.afAuth.onAuthStateChanged(user => {
        if (user) {
          this.firestore.collection('utilisateurs').doc(user.uid).get()
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
