import { AdminGuard } from './services/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPswComponent } from './components/forgot-psw/forgot-psw.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { WaitingListComponent } from './components/waiting-list/waiting-list.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardGuard } from './services/dashboard.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/login', component: SigninComponent },
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/forgot-password', component: ForgotPswComponent },
    { path: 'auth/verify-email', component: VerifyEmailComponent },
    { path: 'waiting-list', component: WaitingListComponent, canActivate: [AuthGuard] },
    { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard] },
    {
        path: 'edit-users',
        loadChildren: () => import('./edit-users/edit-users.module').then(m => m.EditUsersModule),
        canActivate: [AdminGuard]
    },
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
