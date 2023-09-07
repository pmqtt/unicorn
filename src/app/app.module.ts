import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule, NativeScriptFormsModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { TableChartComponent } from './tablechart/tablechart.component'
import { BookingDetailsDialogComponent } from './bookingdetaildialog/booking-details-dialog.component'
import {LoginComponent} from './login/login.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptFormsModule],
  declarations: [AppComponent,
                TableChartComponent,
                BookingDetailsDialogComponent,
                LoginComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
        BookingDetailsDialogComponent
    ]
})
export class AppModule {}
