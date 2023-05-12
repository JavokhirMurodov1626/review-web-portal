import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReviewComponent } from './review/review.component';
import { AccountComponent } from './account/account.component';
import { CreateReviewComponent } from './create-review/create-review.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';
import { EditReviewComponent } from './edit-review/edit-review.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'reviews/:id', component:ReviewComponent},
  {path:'users/:id/account', component:AccountComponent,canActivate:[AuthGuard]},
  {path:'users/:id/account/reviews/:id/edit', component:EditReviewComponent,canActivate:[AuthGuard]},
  {path:'create-review', component:CreateReviewComponent,canActivate:[AuthGuard]},
  {path:'login', component:LoginComponent, canActivate:[LoginGuard]},
  {path:'register', component:RegisterComponent,canActivate:[LoginGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
