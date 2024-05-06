import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'puyfolais-app';
  user: firebase.default.User | null = null;

  constructor(public translateService: TranslateService, public angularFireAuth: AngularFireAuth) {}
  
  ngOnInit() {
    this.angularFireAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  logOut() {
    this.angularFireAuth.signOut();
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }
}
