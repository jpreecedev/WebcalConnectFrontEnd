import {JwtHelper} from "./JwtHelper";
declare var escape: any;

export interface IJwt {
    access_token: string;
    expires_in: number;
}

export function hasValidToken(roles?: string[]): boolean {

    var jwtHelper: JwtHelper = new JwtHelper();
    var token: IJwt = jwtHelper.getToken();

    if (!token || jwtHelper.isTokenExpired(token.access_token)) {
        return false;
    } else {
        return true;
    }
}
