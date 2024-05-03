import { Directive, HostListener, EventEmitter, Output } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "@firebase/auth";

@Directive({
  selector: "[googleSso]",
})
export class GoogleSsoDirective {

  @Output() signInSuccess: EventEmitter<any> = new EventEmitter();


  constructor(private angularFireAuth: AngularFireAuth) {}
  @HostListener("click")
  async onClick() {
    const creds = await this.angularFireAuth.signInWithPopup(
      new GoogleAuthProvider(),
    );
    // Émettre l'événement après une authentification réussie
    this.signInSuccess.emit(creds);
  }
}