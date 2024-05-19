import { Component,  EventEmitter,  Input, OnInit, Output } from '@angular/core';
import { EnumTraductionService } from '../../../service/enum-traduction.service';
import { TypeSeance } from '../../../enum/type-seances';
import { Seance } from '../../../model/seance';

@Component({
  selector: 'app-seance-card',
  templateUrl: './seance-card.component.html',
  styleUrl: './seance-card.component.scss'
})
export class SeanceCardComponent implements OnInit {

  @Input() seance!: Seance;
  @Output() emitSupprimerNouvelleSeance: EventEmitter<Seance> = new EventEmitter<Seance>();

  seanceInitial!: Seance ;
  couleurTypeSeance: string = '';

  constructor(
    public traductionEnumService: EnumTraductionService
  ) { }

  /**
   * on réalise une copie de sauvegarde de l'état initial de la séance pour vérifier si elle a été modifié
   * (ne pas maj si on ne fait rien)
   */
  ngOnInit(): void {
    this.seanceInitial = new Seance(this.seance.uid, this.seance.date, this.seance.type);
    this.determinerCouleurSeance(this.seance.type);
  }

  /**
   * Permet de d'appliquer une couleur par type de séance
   * @param type 
   * @returns 
   */
  determinerCouleurSeance(type?: TypeSeance) {
    switch (type) {
      case TypeSeance.REP:
        this.couleurTypeSeance = 'blue';
        break;
      case TypeSeance.NOR:
        this.couleurTypeSeance = 'green';
        break;
      case TypeSeance.SPE:
        this.couleurTypeSeance = 'orange';
        break;
      default:
        this.couleurTypeSeance = 'white'; // Couleur par défaut si le type n'est pas reconnu
    }
  }

  /**
   * Supprime une séance au clic sur le bouton
   */
  supprimerSeance() {
    if (this.seance.uid !== '') {
    this.seance.supprimee = !this.seance.supprimee;
  } else {
    this.emitSupprimerNouvelleSeance.emit(this.seance);
  }
}

/**
 * Permet de faire varier l'heure de séance
 * @param minutes le nombre de minute (+ ou -) a varier sur l'heure de séance
 */
  ajusterHeureSeance(minutes: number): void {
    const date = new Date(this.seance.date);
    date.setMinutes(date.getMinutes() + minutes);
    this.seance.date = date;
    this.seance.miseAJour =  this.verifierMaj();
  }

  /**
   * Permet d'obtenir la liste des Enum pour affichage après traduction (in HTML) 
   * dans les chips de la carte sénce
   * @returns le tableau des enum
   */
  recupererTypeSeanceAAfficher(): TypeSeance[] {
    return Object.values(TypeSeance)
    .filter(value => value !== TypeSeance.NDE)
    .map(name => TypeSeance[name as keyof typeof TypeSeance]);
  }

  /**
   * Mise à jour de la carte après clic sur une chips "type séance"
   * @param type L'état Séance à appliquer 
   */
  choisirTypeSeance(type: TypeSeance) {
    this.seance.type = type
    this.seance.miseAJour = this.verifierMaj();
    this.determinerCouleurSeance(type);
  }

  /**
   * Vérifie si une mise à jour en BDD est nécessaire (modification heure et/ou type)
   * @returns 
   */
  private verifierMaj(): boolean {
    return !(this.seance.date.getTime() === this.seanceInitial.date.getTime()) 
        || !(this.seance.type === this.seanceInitial.type);
  }
}


