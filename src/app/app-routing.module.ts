import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { TableChartComponent } from './tablechart/tablechart.component'

const routes: Routes = [
  //{ path: '', redirectTo: '/items', pathMatch: 'full' },
  //{ path: 'items', component: ItemsComponent },
  //{ path: 'item/:id', component: ItemDetailComponent },
  { path: '', redirectTo: '/tablechart', pathMatch: 'full' },
  { path: 'tablechart', component: TableChartComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
