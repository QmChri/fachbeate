import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fachberater';

  constructor(private translate: TranslateService){
    this.translate.setDefaultLang('de');
  }

  switchLanguage(language: string){
    this.translate.use(language);
  }


  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
