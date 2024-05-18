import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, filter, forkJoin, map } from 'rxjs';
import { ISeance } from '../interface/seance';
import { Seance } from '../model/seance';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private firestore: AngularFirestore) { }

  recupererListeSeance(references: DocumentReference[]): Observable<Seance[]> {
    // Créer un tableau d'observables pour chaque référence
    const observables = references.map(reference =>
      this.firestore.doc<ISeance>(reference.path).snapshotChanges().pipe(
        filter(changes => !!changes.payload.data()), // Filtrer les valeurs indéfinies
        map(action => {
          const data = action.payload.data() as ISeance;        
          return new Seance(action.payload.id,(data.date as Timestamp).toDate(),data.type);  
        })
      )
    );
  
    // Utiliser combineLatest pour combiner les résultats de tous les observables
    return combineLatest(observables);
  }
  
}