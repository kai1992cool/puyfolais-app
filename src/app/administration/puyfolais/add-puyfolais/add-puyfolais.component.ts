import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { numericValidator } from '../../../app-validators';
import { PuyfolaisService } from '../../../service/puyfolais.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DataGouvService } from '../../../service/data-gouv.service';

@Component({
  selector: 'app-add-puyfolais',
  templateUrl: './add-puyfolais.component.html',
  styleUrl: './add-puyfolais.component.scss'
})
export class AddPuyfolaisComponent implements OnInit {

  addPuyfolaisForm!: FormGroup;
  resultatsRechercheAdresse: any[] = [];

  constructor(
    private fb: FormBuilder,
    private puyfolaisService: PuyfolaisService,
    private router: Router,
    private dataGouvService: DataGouvService
  ) { }

  ngOnInit(): void {
    this.addPuyfolaisForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      numero: ['', [Validators.required, numericValidator()]],
      genre: ['', [Validators.required]],
      dateNaissance: ['', []],
      tel: ['', []],
      email: ['', [Validators.email]],
      adresse: ['', []],
      cp: ['', []],
      ville: ['', []],
      searchAdresse: ['', []]
    });

     // Abonnez-vous aux changements de valeur du champ de recherche avec debounceTime
     this.addPuyfolaisForm.get('searchAdresse')?.valueChanges
     .pipe(
       debounceTime(300), // Attendre 300 millisecondes après la dernière frappe
       distinctUntilChanged() // Ne déclencher que si la valeur a changé
     )
     .subscribe(value => {
       this.rechercherAdresses(value);
     });
     
  }

  annulerCreationPuyfolais() {
    this.router.navigate(['/admin/puyfolais']);
  }

  validerCreationPuyfolais() {
    if (this.addPuyfolaisForm.valid) {
      this.puyfolaisService.creerPuyfolais(this.addPuyfolaisForm).then(() => {
        // Une fois la promesse résolue, naviguez vers la route /admin/puyfolais
        this.router.navigate(['/admin/puyfolais']);
      });
    }
  }

  // Méthode appelée lorsque l'utilisateur sélectionne une suggestion
  selectionnerAdresse(address: any) {
    this.addPuyfolaisForm.patchValue({
      adresse: address.name,
      cp: address.postcode,
      ville: address.city,
      searchAdresse: address.label
    });
    this.resultatsRechercheAdresse = []; // Réinitialise la liste des résultats après la sélection
  }

  rechercherAdresses(query: string) {
    // Vérifie que query est une chaîne de caractères
    if (typeof query === 'string' && query.trim() !== '') {
      this.dataGouvService.searchAddress(query).subscribe(results => {
        this.resultatsRechercheAdresse = results;
      });
    } else {
      this.resultatsRechercheAdresse = []; // Réinitialise la liste des résultats si la requête est vide ou non valide
    }
  }
}
