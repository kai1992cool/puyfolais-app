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
    try {
      const creds = await this.angularFireAuth.signInWithPopup(new GoogleAuthProvider());
      // Vérifier si l'utilisateur existe déjà dans Firebase Authentication
      if (creds.additionalUserInfo && creds.additionalUserInfo.isNewUser) {
        // Nouvel utilisateur, émettre l'événement de succès
        this.signInSuccess.emit(creds);
      } else {
        // Utilisateur existant, émettre un événement d'échec avec un message d'erreur
        this.signInSuccess.emit({ error: "Ce compte existe déjà." });
      }
    } catch (error) {
      // En cas d'erreur, émettre un événement d'échec
      this.signInSuccess.emit({ error: error });
    }
  }
}