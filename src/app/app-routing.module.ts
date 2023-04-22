import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReviewComponent } from './review/review.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'reviews/:id', component:ReviewComponent},
  {path:'account', component:AccountComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
