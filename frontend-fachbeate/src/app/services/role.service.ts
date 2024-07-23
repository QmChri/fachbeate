import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roleMap: Map<string, number> = new Map;
  roles: string[] = [];
  public userProfile: KeycloakProfile | null = null;

  constructor(private keycloak: KeycloakService) {

    // Zuteilung der Rollen auf levels(numbers) für einfachere Zurodnung
    //geschaeftsleitung:1
    //abteilungsleitung:2
    //vertreter-frontend:3
    //fachberater-frontend:4
    //front-office:5
    //haendler-tochter:6
    //admin-frontend:7

    this.roleMap.set("geschaeftsleitung", 1)
    this.roleMap.set("abteilungsleitung", 2)
    this.roleMap.set("vertreter", 3)
    this.roleMap.set("fachberater", 4)
    this.roleMap.set("front-office", 5)
    this.roleMap.set("haendler-toechter", 6)
    this.roleMap.set("admin", 7)

  }

  async initialize(): Promise<void> {
    try {
      await this.loadUserProfile();
      await this.loadUserRoles();
    } catch (error) {
      console.error('Error initializing RoleService:', error);
    }
  }

  private async loadUserProfile(): Promise<void> {
    try {
      this.userProfile = await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  private async loadUserRoles(): Promise<void> {
    try {
      this.roles = await this.keycloak.getUserRoles();
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  }

  checkPermission(requiredRoles: number[]) {
    return this.roles
      .map(role => this.roleMap.get(role))
      .some(roleId => requiredRoles.includes(roleId!));
  }

  getAllUser(){

  }

  getPermissions() {
    return this.roles;
  }

  getEmail(){
    //return "none";
    return this.userProfile!.email;
  }
  getUserName() {
    //return "none"
    return this.userProfile!.username;
  }

  setRoles(roles: string[]) {

    this.roles = roles;
  }

  setProfile(profile: KeycloakProfile) {
    this.userProfile = profile;
  }

}
