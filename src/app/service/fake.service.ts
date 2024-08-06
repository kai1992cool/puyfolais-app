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
      nom: faker.person.lastName().toLowerCase(),
      prenom: faker.person.firstName().toLowerCase(),
      genre: faker.string.fromCharacters(['F', 'M']),
      dateNaissance: Timestamp.fromDate(faker.date.birthdate({ min: 2, max: 90, mode: 'age' })),
      numeroTelephone: faker.phone.number(),
      email: faker.internet.email().toLowerCase(),
      adresse: faker.location.streetAddress({ useFullAddress: true }) + " " +faker.location.zipCode() + " " + faker.location.city().toUpperCase()
    };
  }

  private async addRecordToFirestore(): Promise<void> {
    // Générer des données aléatoires
    const randomData = this.generateRandomData();
    // Ajouter les données à la collection "puyfolais"
    await this.collection.add(randomData);
  }

  async generateRecords(): Promise<void> {
    for (let i = 0; i < 200; i++) {
      await this.addRecordToFirestore();
      console.log(`Enregistrement ${i + 1} ajouté.`);
    }
    console.log("Tous les enregistrements ont été ajoutés avec succès.");
  }

}
