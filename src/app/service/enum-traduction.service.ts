import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EtatSaison } from '../enum/etat-saison';
import { EtatSeance } from '../enum/etat-seances';

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

  traduireEtatSeance(enumValue: EtatSeance): string {
    switch (enumValue) {
      case EtatSeance.NOR:
        return this.translateService.instant('enum.etatSeance.NOR');
      case EtatSeance.SPE:
        return this.translateService.instant('enum.etatSeance.SPE');
      case EtatSeance.REP:
        return this.translateService.instant('enum.etatSeance.REP');
      default:
        return '';
    }
  }

}
