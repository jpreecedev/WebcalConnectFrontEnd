import {JwtHelper} from "./JwtHelper";
declare var escape: any;

export interface IJwt {
    access_token: string;
    expires_in: number;
}

export function hasValidToken(roles?: string[]): boolean {

    roles = roles || ["TachographCentre"];

    var jwtHelper: JwtHelper = new JwtHelper();
    var token: IJwt = jwtHelper.getToken();
    var hasTokenExpired: boolean = jwtHelper.isTokenExpired(token ? token.access_token : undefined);
    var hasUserRole: boolean = false;

    var userRoles: string[] = token ? jwtHelper.getRoles(token.access_token) : undefined;

    if (userRoles) {
        for (var index: number = 0; index < userRoles.length; index++) {
            var element: string = userRoles[index];
            if (roles.indexOf(element) > -1) {
                hasUserRole = true;
                break;
            }
        }
    }

    return !hasTokenExpired && hasUserRole;
}

export function isAdministrator(): boolean {
    var jwtHelper: JwtHelper = new JwtHelper();
    var token: IJwt = jwtHelper.getToken();
    var userRoles: string[] = token ? jwtHelper.getRoles(token.access_token) : undefined;

    for (var index: number = 0; index < userRoles.length; index++) {
        var element: string = userRoles[index];
        if (element === "Administrator") {
            return true;
        }
        return false;
    }
}
