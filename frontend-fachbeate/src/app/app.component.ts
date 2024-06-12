import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/*import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';*/

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fachberater';
  roles: string[] = [];
 // public userProfile: KeycloakProfile | null = null;

  constructor(/*private keycloak: KeycloakService,*/ private translate: TranslateService) {
    this.translate.setDefaultLang('de');
  }
  public async ngOnInit() {
    /*this.roles = this.keycloak.getUserRoles();
    this.keycloak.loadUserProfile().then(profile => {
      this.userProfile = profile;
      console.log(this.userProfile)
    });*/
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
