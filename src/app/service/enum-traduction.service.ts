import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EtatSaison } from '../enum/etat-saison';
import { TypeSeance } from '../enum/type-seances';

@Injectable({
  providedIn: 'root'
})
export class EnumTraductionService {

  constructor(private translateService: TranslateService) { }

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

  traduireTypeSeance(enumValue: TypeSeance | undefined): string {
    if (enumValue) {
      const val = this.stringToEnum(enumValue, TypeSeance);
      if (val) {
        switch (val) {
          case TypeSeance.NOR:
            return this.translateService.instant('enum.typeSeance.NOR');
          case TypeSeance.SPE:
            return this.translateService.instant('enum.typeSeance.SPE');
          case TypeSeance.REP:
            return this.translateService.instant('enum.typeSeance.REP');
          default:
            return '';
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  stringToEnum<T>(str: string, enumObj: any): T[keyof T] | undefined {
    const enumValues = Object.values(enumObj) as string[];
    if (enumValues.includes(str)) {
      return str as unknown as T[keyof T];
    }
    return undefined;
  }



}
