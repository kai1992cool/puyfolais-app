import { Injectable } from '@angular/core';
import { IPuyfolais } from '../interface/puyfolais';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { faker } from '@faker-js/faker/locale/fr';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  constructor(private firestore: AngularFirestore) { }

  collection: AngularFirestoreCollection<IPuyfolais> = this.firestore.collection<IPuyfolais>('puyfolais')

  private generateRandomData(): any {
    return {
      numero: faker.number.int(),
      nom: faker.person.lastName(),
      prenom: faker.person.firstName(),
      genre: faker.string.fromCharacters(['F', 'M']),
      dateNaissance: Timestamp.fromDate(faker.date.birthdate()),
      numeroTelephone: faker.phone.number(),
      email: faker.internet.email(),
      adresse: faker.location.streetAddress(),
      cp: faker.location.zipCode(),
      ville: faker.location.city()
    };
  }

  private async addRecordToFirestore(): Promise<void> {
    // Générer des données aléatoires
    const randomData = this.generateRandomData();
    // Ajouter les données à la collection "puyfolais"
    await this.collection.add(randomData);
  }

  async generateRecords(): Promise<void> {
    for (let i = 0; i < 995; i++) {
      await this.addRecordToFirestore();
      console.log(`Enregistrement ${i + 1} ajouté.`);
    }
    console.log("Tous les enregistrements ont été ajoutés avec succès.");
  }

}
