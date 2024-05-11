import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Utilisateur } from '../interface/utilisateur';
import { Observable, map, filter, switchMap, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(
    private firestore: AngularFirestore,
    public authentificationFirebaseAngular: AngularFireAuth
  ) { }

  /**
   * Créé un utilisateur dans Firestore
   * @param userId UID de l'utilisateur (celui de Firebase Auth)
   * @param email L'email de l'utilisateur
   * @param nom Le nom de l'utilisateur
   * @param prenom Le prénom de l'utilisateur
   * @param permissions Les permissions accordées à l'utilisateur (DEF si non fourni)
   * @returns Le promize résultant de la création utilisateur
   */
  creerUtilisateur(userId: string, email: string, nom: string, prenom: string, permissions?: string[]): Promise<void> {
    if (!permissions) {
      permissions = ['DEF'];
    }
    return this.firestore.collection('utilisateurs').doc(userId).set({ email, nom, prenom, permissions });
  }

  /**
   * Retourne la liste des permission d'un utilisateur
   * @param userId l'UID de l'utilisateur
   * @returns un tableau contenant la liste des permissions de l'utilisateur
   */
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

/**
 * Permet de vérifier si l'utilisateur possède un rôle. Si aucun uid utilisateur n'est transmis, on vérifie l'utilisateur courant
 * @param permission La permission a vérifier
 * @param uidUtilisateur l'UID de l'utilisateur (si pas utilisateur connecté)
 * @returns true si l'utilisateur possède le droit, false dans tous les autres cas.
 */
  possedePermission(permission: string, uidUtilisateur?: string): Observable<boolean> {
    if (!uidUtilisateur) {
    return this.authentificationFirebaseAngular.authState.pipe(
      switchMap(user => {
        if (user) {
          const permissionUtilisateurFirestore = this.recupererPermissionsUtilisateur(user.uid);
          return permissionUtilisateurFirestore.pipe(
            filter(permissions => permissions.includes(permission)),
            map(permissions => permissions.length > 0) 
          );
        } else {
          return of(false); 
        }
      })
    );
   }  else {
    const permissionUtilisateurFirestore = this.recupererPermissionsUtilisateur(uidUtilisateur);
    return permissionUtilisateurFirestore.pipe(
      filter(permissions => permissions.includes(permission)),
      map(permissions => permissions.length > 0) 
    );
   }
}
}
