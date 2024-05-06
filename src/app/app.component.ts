import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'puyfolais-app';
  
  constructor(public translateService: TranslateService,public angularFireAuth: AngularFireAuth) {}
  
  logOut() {
    this.angularFireAuth.signOut();
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }
}
