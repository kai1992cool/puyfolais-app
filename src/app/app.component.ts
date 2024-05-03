import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'puyfolais-app';
  constructor(public angularFireAuth: AngularFireAuth) {}
  logOut() {
    this.angularFireAuth.signOut();
  }
}
