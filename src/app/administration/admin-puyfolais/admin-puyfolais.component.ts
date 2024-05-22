import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Puyfolais } from '../../model/puyfolais';
import { PuyfolaisService } from '../../service/puyfolais.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-puyfolais',
  templateUrl: './admin-puyfolais.component.html',
  styleUrl: './admin-puyfolais.component.scss'
})
export class AdminPuyfolaisComponent implements AfterViewInit  {

  constructor(
    private dialog: MatDialog,
    public traductionService: TranslateService
    ) { }

  listePuyfolais: Puyfolais[] = [];
  puyfolaisSubscription: Subscription | undefined; // Garder une référence à l'abonnement pour pouvoir s'en désabonner
  puyfolaisService = inject(PuyfolaisService);
  @ViewChild('searchInput') searchInput: any; // Référence à l'élément input de recherche

  
  ngAfterViewInit() {
    this.mettreAJourListePuyfolais();
  }

  mettreAJourListePuyfolais() {
    // Se désabonner de l'observable précédent s'il existe
    if (this.puyfolaisSubscription) {
      this.puyfolaisSubscription.unsubscribe();
    }

    // Récupérer le texte de l'input de recherche
    const searchText = this.searchInput.nativeElement.value;

    // Souscrire à un nouvel observable avec le texte de recherche
    this.puyfolaisSubscription = this.puyfolaisService.recupererPuyfolais(searchText).subscribe(puyfolais => {
      this.listePuyfolais = puyfolais.sort((a, b) => a.nom!.localeCompare(b.nom!));
    });
  }
}
