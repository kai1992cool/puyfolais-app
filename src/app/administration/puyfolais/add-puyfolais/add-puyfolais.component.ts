import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { numericValidator } from '../../../app-validators';
import { PuyfolaisService } from '../../../service/puyfolais.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-add-puyfolais',
  templateUrl: './add-puyfolais.component.html',
  styleUrl: './add-puyfolais.component.scss'
})
export class AddPuyfolaisComponent implements OnInit {

  addPuyfolaisForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private puyfolaisService: PuyfolaisService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addPuyfolaisForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      numero: ['', [Validators.required, numericValidator()]],
      genre: ['',[Validators.required]],
      dateNaissance: ['',[]]
      // email: ['', [Validators.required, Validators.email]]
    });
  }

  annulerCreationPuyfolais() {
    throw new Error('Method not implemented.');
  }

  validerCreationPuyfolais() {
    if (this.addPuyfolaisForm.valid) {
      this.puyfolaisService.creerPuyfolais(this.addPuyfolaisForm).then(() => {
        // Une fois la promesse résolue, naviguez vers la route /admin/puyfolais
        this.router.navigate(['/admin/puyfolais']);
      });
    } 
  }

}
