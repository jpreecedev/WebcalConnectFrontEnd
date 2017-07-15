import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalibrationsDueComponent } from './calibrations-due/calibrations-due.component';
import { GenerateEmailComponent } from './generate-email/generate-email.component';
import { InspectionDataComponent } from './inspection-data/inspection-data.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecentCalibrationsComponent } from './recent-calibrations/recent-calibrations.component';
import { QCCheckComponent } from './qc-check/qc-check.component';
import { CentreCheckComponent } from './centre-check/centre-check.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ManageAccessComponent } from './manage-access/manage-access.component';
import { SoftwareLicensesComponent } from './software-licenses/software-licenses.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { DetailedExceptionsComponent } from './detailed-exceptions/detailed-exceptions.component';
import { DirectUploadComponent } from './direct-upload/direct-upload.component';

import { LoggedInGuard } from './utilities/loggedin.guard';

export const ROUTES = [
    { path: '', component: HomeComponent, role: '', useAsDefault: true },
    { path: 'login', role: '', component: LoginComponent },
    { path: 'dashboard', role: 'TachographCentre', component: DashboardComponent, canActivate: [LoggedInGuard] },
    { path: 'calibrations-due', role: 'TachographCentre', component: CalibrationsDueComponent, canActivate: [LoggedInGuard] },
    { path: 'generate-email', role: 'TachographCentre', component: GenerateEmailComponent, canActivate: [LoggedInGuard] },
    { path: 'status-report', role: 'TachographCentre', component: StatusReportComponent, canActivate: [LoggedInGuard] },
    { path: 'inspection-data', role: 'TachographCentre', component: InspectionDataComponent, canActivate: [LoggedInGuard] },
    { path: 'recent-calibrations', role: 'TachographCentre', component: RecentCalibrationsComponent, canActivate: [LoggedInGuard] },
    { path: 'qc-check', role: 'TachographCentre', component: QCCheckComponent, canActivate: [LoggedInGuard] },
    { path: 'centre-check', role: 'TachographCentre', component: CentreCheckComponent, canActivate: [LoggedInGuard] },
    { path: 'register-user', role: 'Administrator', component: RegisterUserComponent, canActivate: [LoggedInGuard] },
    { path: 'manage-access', role: 'Administrator', component: ManageAccessComponent, canActivate: [LoggedInGuard] },
    { path: 'software-licenses', role: 'Administrator', component: SoftwareLicensesComponent, canActivate: [LoggedInGuard] },
    { path: 'detailed-exceptions', role: 'Administrator', component: DetailedExceptionsComponent, canActivate: [LoggedInGuard] },
    { path: 'direct-upload', role: 'DirectUpload', component: DirectUploadComponent, canActivate: [LoggedInGuard] },
    { path: 'address-book', role: 'TachographCentre', component: AddressBookComponent, canActivate: [LoggedInGuard] },
    { path: 'change-password', role: 'TachographCentre', component: ChangePasswordComponent, canActivate: [LoggedInGuard] }
];


export const routing = RouterModule.forRoot(ROUTES, { useHash: true });
