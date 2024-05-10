import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private firestore: AngularFirestore) { }

  createUser(userId: string, email: string, nom: string, prenom: string, role?: string): Promise<void> {
    if (!role) {
      role = 'DEF';
    }
    return this.firestore.collection('utilisateurs').doc(userId).set({ email, nom, prenom, role });
  }
}
