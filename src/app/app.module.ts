import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule, NativeScriptFormsModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { TableChartComponent } from './tablechart/tablechart.component'
import { BookingDetailsDialogComponent } from './bookingdetaildialog/booking-details-dialog.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptFormsModule],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent, TableChartComponent, BookingDetailsDialogComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
        BookingDetailsDialogComponent
    ]
})
export class AppModule {}
