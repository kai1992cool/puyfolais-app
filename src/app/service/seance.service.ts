import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, map } from 'rxjs';
import { ISeance } from '../interface/seance';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private firestore: AngularFirestore) { }


}