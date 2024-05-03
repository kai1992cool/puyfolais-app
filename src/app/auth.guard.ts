import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";

export const authGuard: CanActivateFn = async (route, state) => {
  const angularFireAuth = inject(AngularFireAuth);
  const router = inject(Router);
  const user = await angularFireAuth.currentUser;
  // coerce to boolean
  const isLoggedIn = !!user;
  if (!isLoggedIn) {
    router.navigateByUrl('/signin');
  }
  return isLoggedIn;
};