import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizeDate'
})
export class LocalizeDatePipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private translateService: TranslateService
  ) {}

  transform(value: any, format: string): any {
    // Récupérer la langue définie par l'utilisateur
    const userLang = this.translateService.currentLang || this.locale;
    // Convertir la date en objet Date
    const date = new Date(value);
    // Formater la date dans un format standard
    return  formatDate(date, format, userLang);
    // Utiliser le format local pour afficher la date
    // return formatDate(formattedDate, format, userLang);
  }

}
