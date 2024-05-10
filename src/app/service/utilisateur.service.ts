import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Utilisateur } from '../interface/utilisateur';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(
    private firestore: AngularFirestore) { }

  creerUtilisateur(userId: string, email: string, nom: string, prenom: string, permissions?: string[]): Promise<void> {
    if (!permissions) {
      permissions = ['DEF'];
    }
    return this.firestore.collection('utilisateurs').doc(userId).set({ email, nom, prenom, permissions });
  }

  recupererPermissionsUtilisateur(userId: string): Observable<string[]> {
    return this.firestore.collection('utilisateurs').doc(userId).get().pipe(
      map(documentSnapshot => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data() as Utilisateur;
          return userData.permissions || [];
        } else {
          return [];
        }
      })
    );
  }
}
