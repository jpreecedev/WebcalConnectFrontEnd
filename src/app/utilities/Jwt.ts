import { JwtHelper } from './JwtHelper';
declare var escape: any;

export interface IJwt {
    access_token: string;
    expires_in: number;
}

export function hasValidToken(roles?: string[]): boolean {

    roles = roles || ['TachographCentre'];

    let jwtHelper = new JwtHelper();
    let token = jwtHelper.getToken();
    let hasTokenExpired = jwtHelper.isTokenExpired(token ? token.access_token : undefined);
    let hasUserRole = false;

    let userRoles = token ? jwtHelper.getRoles(token.access_token) : undefined;

    if (userRoles) {
        for (let index = 0; index < userRoles.length; index++) {
            let element = userRoles[index];
            if (roles.indexOf(element) > -1) {
                hasUserRole = true;
                break;
            }
        }
    }

    return !hasTokenExpired && hasUserRole;
}

export function isAdministrator(): boolean {
    let jwtHelper = new JwtHelper();
    let token = jwtHelper.getToken();
    let userRoles = token ? jwtHelper.getRoles(token.access_token) : [];

    for (let index = 0; index < userRoles.length; index++) {
        let element = userRoles[index];
        if (element === 'Administrator') {
            return true;
        }
    }
    return false;
}

export function isDirectUploadUser(): boolean {
    let jwtHelper = new JwtHelper();
    let token = jwtHelper.getToken();
    let userRoles = token ? jwtHelper.getRoles(token.access_token) : [];

    for (let index = 0; index < userRoles.length; index++) {
        let element = userRoles[index];
        if (element === 'DirectUpload' || element === 'Administrator') {
            return true;
        }
    }
    return false;
}
