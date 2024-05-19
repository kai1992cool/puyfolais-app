import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, filter, forkJoin, map } from 'rxjs';
import { ISeance } from '../interface/seance';
import { Seance } from '../model/seance';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<ISeance> = this.firestore.collection<ISeance>('seances')

  creerListeSeances(seances: Seance[]): Promise<DocumentReference<ISeance>[]> {
    const listDoc: Promise<DocumentReference<ISeance>>[] = [];

    seances.forEach(seanceAcreer => {

      
    const iseance: ISeance = {
      date: Timestamp.fromDate(seanceAcreer.date),
      type: seanceAcreer.type
    };

      const promise = this.collection.add(iseance);
      listDoc.push(promise);
    });

    return Promise.all(listDoc);
  }


  majListeSeances(seances: Seance[]): Promise<DocumentReference<ISeance>[]> {
    const listDoc: Promise<DocumentReference<ISeance>>[] = [];

    seances.forEach(seanceAmodifier => {

      const iseance: ISeance = {
        date: Timestamp.fromDate(seanceAmodifier.date),
        type: seanceAmodifier.type
      };

      const promise = this.collection.doc(seanceAmodifier.uid).update(iseance).then(() => this.firestore.collection<ISeance>('seances').doc(seanceAmodifier.uid).ref);
      listDoc.push(promise);
    });

    return Promise.all(listDoc);
  }

  listeSeancesNonImpactees(seances: Seance[]): Promise<DocumentReference<ISeance>[]> {
    const listDoc: DocumentReference<ISeance>[] = [];
     seances.forEach(seanceNonImpactee => {
      const promise =  this.collection.doc(seanceNonImpactee.uid).ref
      listDoc.push(promise);
    });
    return Promise.all(listDoc);
  }

  supprimerListeSeances(seances: Seance[]): Promise<void> {
    const listDoc: Promise<void>[] = [];
    seances.forEach(seanceAsupprimer => {
      const promise = this.collection.doc(seanceAsupprimer.uid).delete()
      listDoc.push(promise);
    });
    return Promise.all(listDoc).then(() => {});  
  }


  recupererListeSeance(references: DocumentReference[]): Observable<Seance[]> {
    // Créer un tableau d'observables pour chaque référence
    const observables = references.map(reference =>
      this.firestore.doc<ISeance>(reference.path).snapshotChanges().pipe(
        filter(changes => !!changes.payload.data()), // Filtrer les valeurs indéfinies
        map(action => {
          const data = action.payload.data() as ISeance;
          return new Seance(action.payload.id, (data.date as Timestamp).toDate(), data.type);
        })
      )
    );

    // Utiliser combineLatest pour combiner les résultats de tous les observables
    return combineLatest(observables);
  }

}