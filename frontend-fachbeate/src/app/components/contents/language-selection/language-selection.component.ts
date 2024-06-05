import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-language-selection',
  standalone: true,
  imports: [],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.scss'
})
export class LanguageSelectionComponent {

  constructor(private translate: TranslateService, private bottomSheetRef: MatBottomSheetRef<LanguageSelectionComponent>) {
    this.translate.setDefaultLang('de');
  }
  switchLanguage(language: string) {
    this.translate.use(language);
    this.bottomSheetRef.dismiss();
    console.log("adads" + language)
  }
}
