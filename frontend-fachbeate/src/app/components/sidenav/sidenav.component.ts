import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { INavbarData } from './helper';
import { KeycloakService } from 'keycloak-angular';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],

  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(0.5turn)', offset: '1' })
          ]))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  currentUrl = "";

  constructor(private notificationService: NotificationService, public translate: TranslateService, private readonly keycloak: KeycloakService,
    public roleService: RoleService) {
    this.translate.addLangs(['en', 'de','ru']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  public async logout() {
    this.keycloak.logout();
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.translate.get('STANDARD.language_changed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(0, translatedMessage, language, 'topRight');
    });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.toggleCollapse()
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleCLick(item: INavbarData): void {
    if (item.items !== null && item.items !== undefined && item.items.length !== 0) {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }

    for (let modelItem of this.navData) {
      if (item !== modelItem && modelItem.expanded) {
        modelItem.expanded = false;
      }
    }

    item.expanded = !item.expanded
  }
}
