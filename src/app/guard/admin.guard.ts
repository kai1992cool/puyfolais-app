import { CanActivateFn } from "@angular/router";
import { UtilisateurService } from '../service/utilisateur.service';
import { of, switchMap } from 'rxjs';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Profil } from "../enum/profil";

export const adminGuard: CanActivateFn = (route, state) => {

  const utilisateurService = inject(UtilisateurService);
  const router = inject(Router);

  // Use 'pipe' to flatten the nested observable
  return utilisateurService.possedePermission(Profil.Administrateur)
    .pipe(
      switchMap(estAdmin => {
        if (!estAdmin) {
          router.navigateByUrl('/');
          return of(false); 
        } else {
          return of(true); 
        }
      })
    );
};

