import { Component } from "@angular/core";
import {LoginService} from "../service/login.service";
import * as appSettings from '@nativescript/core/application-settings';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public username: string;
    public password: string;

    constructor(private loginService: LoginService) {
    }

    login() {
        const success = this.loginService.login(this.username, this.password);
        appSettings.setString("username", "tekin.kirhan");
        appSettings.setString("password", "test1234");
        if(success) {
            // Hier könnte die Login-Logik stehen, z.B. ein API-Aufruf
            console.log("Versuche einzuloggen mit:", this.username, this.password);
        } else {
            // Zeige eine Fehlermeldung oder ähnliches
            console.log("Bitte Benutzername und Passwort eingeben!");
        }
    }
}
