import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalibrationsDueComponent } from './calibrations-due/calibrations-due.component';
import { GenerateEmailComponent } from './generate-email/generate-email.component';
import { InspectionDataComponent } from './inspection-data/inspection-data.component';
import { AddressBookComponent } from './address-book/address-book.component';
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
    { path: '', name: 'Home', component: HomeComponent, role: '', useAsDefault: true },
    { path: 'login', name: 'Login', role: '', component: LoginComponent },
    { path: 'dashboard', name: 'Dashboard', role: 'TachographCentre', component: DashboardComponent, canActivate: [LoggedInGuard] },
    { path: 'calibrations-due', name: 'CalibrationsDue', role: 'TachographCentre', component: CalibrationsDueComponent, canActivate: [LoggedInGuard] },
    { path: 'generate-email', name: 'GenerateEmail', role: 'TachographCentre', component: GenerateEmailComponent, canActivate: [LoggedInGuard] },
    { path: 'status-report', name: 'StatusReport', role: 'TachographCentre', component: StatusReportComponent, canActivate: [LoggedInGuard] },
    { path: 'inspection-data', name: 'InspectionData', role: 'TachographCentre', component: InspectionDataComponent, canActivate: [LoggedInGuard] },
    { path: 'recent-calibrations', name: 'RecentCalibrations', role: 'TachographCentre', component: RecentCalibrationsComponent, canActivate: [LoggedInGuard] },
    { path: 'qc-check', name: 'QCCheck', role: 'TachographCentre', component: QCCheckComponent, canActivate: [LoggedInGuard] },
    { path: 'centre-check', name: 'CentreCheck', role: 'TachographCentre', component: CentreCheckComponent, canActivate: [LoggedInGuard] },
    { path: 'register-user', name: 'RegisterUser', role: 'Administrator', component: RegisterUserComponent, canActivate: [LoggedInGuard] },
    { path: 'manage-access', name: 'ManageAccess', role: 'Administrator', component: ManageAccessComponent, canActivate: [LoggedInGuard] },
    { path: 'software-licenses', name: 'SoftwareLicenses', role: 'Administrator', component: SoftwareLicensesComponent, canActivate: [LoggedInGuard] },
    { path: 'detailed-exceptions', name: 'DetailedExceptions', role: 'Administrator', component: DetailedExceptionsComponent, canActivate: [LoggedInGuard] },
    { path: 'direct-upload', name: 'DirectUpload', role: 'DirectUpload', component: DirectUploadComponent, canActivate: [LoggedInGuard] },
    { path: 'address-book', name: 'AddressBook', role: 'TachographCentre', component: AddressBookComponent, canActivate: [LoggedInGuard] }
];
