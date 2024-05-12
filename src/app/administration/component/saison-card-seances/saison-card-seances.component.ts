import { Component, Input, OnInit } from '@angular/core';
import { ISaison } from '../../../interface/saison';
import { ISeance } from '../../../interface/seance';
import { SeanceService } from '../../../service/seance.service';

@Component({
  selector: 'app-saison-card-seances',
  templateUrl: './saison-card-seances.component.html',
  styleUrl: './saison-card-seances.component.scss'
})
export class SaisonCardSeancesComponent implements OnInit {

  @Input() saison!: ISaison;
  listeJoursPeriode: SeanceTravail[] = [];
  listeSeances: ISeance[] = [];

  constructor(private seanceService: SeanceService) {}

  ngOnInit(): void {
    this.recupererTousLesJoursDeLaSaison();
    this.recupererSeancesExistantes();
  }

  /**
   * Ce code récupère pour la saison chaque séance dans la collection firestore pour ensuite etre rapproché avec les jours de la période
   */
  recupererSeancesExistantes(): void {
  //   this.seanceService.recupererListeSeances(this.saison.seances)
  //     .then(seances => {
  //       this.listeSeances = seances;
  //       this.rapprocherSeancesExistantes(); 
  //     })
  //     .catch(error => {
  //       console.error('Une erreur est survenue : ', error);
  //     });
  }

  /**
   * Réalise un rapprochement entre la liste des seances affectées à la saison et la liste des jours de la période
   * Chaque jour du tableau concerné par une séance existante est mise à jour avec la dite séance
   * Ce tableau servira à l'alimentation du composant HTML
   */
  rapprocherSeancesExistantes(): void {
    this.listeSeances.forEach(seance => {
      const seanceDate = seance.date.toDate();
      const jour = this.listeJoursPeriode.find(jour => this.compareDates(jour.date, seanceDate));
      if (jour) {
        jour.seance = seance;
      }
    });
    console.log(this.listeSeances);
    console.log(this.listeJoursPeriode);
  }

  /**
   * Pour une saison donnée, met à jour le tableau des jours de la saison en initialisant des Seances
   */
  recupererTousLesJoursDeLaSaison(): void {
    const jours: SeanceTravail[] = [];
    const dateDebut = new Date(this.saison.dateDebut.toDate());
    let dateActuelle = dateDebut;
    const dateFin = new Date(this.saison.dateFin.toDate());

    while (dateActuelle <= dateFin) {
      const dateAInserer = new Date(dateActuelle);
      jours.push(new SeanceTravail(dateAInserer));
      dateActuelle.setDate(dateActuelle.getDate() + 1);
    }

    this.listeJoursPeriode = jours;
  }

  compareDates(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

class SeanceTravail {
  date: Date;
  seance?: ISeance;
  selectionne = false;

  constructor(date: Date) {
    this.date = date;
  }
}
