import { CanActivateFn } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UtilisateurService } from '../service/utilisateur.service';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const adminGuard: CanActivateFn = (route, state) => {

  const angularFireAuth = inject(AngularFireAuth);
  const utilisateurService = inject(UtilisateurService);
  const router = inject(Router);

  return angularFireAuth.authState.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        router.navigateByUrl('/');
        return of(false);
      }
      return utilisateurService.recupererPermissionsUtilisateur(user.uid).pipe(
        map(permissions => {
          const isAdmin = permissions.includes('ADM');
          if (!isAdmin) {
            router.navigateByUrl('/');
          }
          return isAdmin;
        })
      );
    })
  );
};
