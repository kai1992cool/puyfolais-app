import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, filter, forkJoin, map } from 'rxjs';
import { ISeance } from '../interface/seance';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private firestore: AngularFirestore) { }

  recupererListeSeance(references: DocumentReference[]): Observable<ISeance[]> {
    // Créer un tableau d'observables pour chaque référence
    const observables = references.map(reference =>
      this.firestore.doc<ISeance>(reference.path).snapshotChanges().pipe(
        filter(changes => !!changes.payload.data()), // Filtrer les valeurs indéfinies
        map(changes => {
          const data = changes.payload.data() as ISeance;
          data.uid = changes.payload.id;
          return {  ...data } as ISeance;
        })
      )
    );
  
    // Utiliser combineLatest pour combiner les résultats de tous les observables
    return combineLatest(observables);
  }
  
}