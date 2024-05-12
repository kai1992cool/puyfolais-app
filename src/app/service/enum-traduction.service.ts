import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EtatSaison } from '../enum/etat-saison';

@Injectable({
  providedIn: 'root'
})
export class EnumTraductionService {

  constructor(private translateService: TranslateService) {}

  traduireEtatSaison(enumValue: EtatSaison): string {
    switch (enumValue) {
      case EtatSaison.ENC:
        return this.translateService.instant('enum.etatSaison.ENC');
      case EtatSaison.AVN:
        return this.translateService.instant('enum.etatSaison.AVN');
      case EtatSaison.PAS:
        return this.translateService.instant('enum.etatSaison.PAS');
      default:
        return '';
    }
  }

}
