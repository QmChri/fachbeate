import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakProfile } from 'keycloak-js';
import { RoleService } from './services/role.service';

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
  screenWidth = 0;
  isSideNavCollapsed = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(public translate: TranslateService, private roleService: RoleService) {
    this.translate.setDefaultLang('de');
  }

  public async ngOnInit() {
    this.roleService.initialize()
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}