import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Puyfolais } from '../../model/puyfolais';
import { PuyfolaisService } from '../../service/puyfolais.service';
import { Subscription, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-puyfolais',
  templateUrl: './admin-puyfolais.component.html',
  styleUrl: './admin-puyfolais.component.scss'
})
export class AdminPuyfolaisComponent implements AfterViewInit  {

  constructor(
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
    const searchText = this.searchInput.nativeElement.value.toLowerCase();

    // Souscrire à un nouvel observable avec le texte de recherche
    this.puyfolaisSubscription = this.puyfolaisService.recupererPuyfolais(searchText)
    .pipe(
      debounceTime(300), // Adjust debounce time as needed
      distinctUntilChanged(), // Only emit if the value has changed
      tap(() => {
        // Show loading indicator
      })
    )
    .subscribe(puyfolais => {
      // Hide loading indicator
      this.listePuyfolais = puyfolais;
    });
  }
}
