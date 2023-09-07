import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as appSettings from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private router: Router) { }

    login(username: string, password: string): boolean {
        // Einfache Überprüfung (du kannst hier natürlich komplexere Logik hinzufügen)
        let u: string = appSettings.getString("username");
        let p: string = appSettings.getString("password");
        if (username === u && password === p) {
            // Bei erfolgreicher Anmeldung zur TableChartComponent navigieren
            this.router.navigate(['/tablechart']);
            return true;
        } else {
            return false;
        }
    }
}
