import { Component,  Input, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titre-page',
  templateUrl: './titre-page.component.html',
  styleUrl: './titre-page.component.scss'
})
export class TitrePageComponent {

  @Input() titre!: string;
  @Input() introduction!: string;
  @Input() redirection?: string;

  constructor(private router: Router) { }

  redirigerVers() {
    if (this.redirection) {
      this.router.navigate([this.redirection]);
    }
  }
}
