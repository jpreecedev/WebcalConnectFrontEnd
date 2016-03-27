import {IJwt} from "./Jwt";
import {Cookie} from "./cookies";

declare var escape: any;

export interface IJwtBody {
    aud: string;
    exp: number;
    iss: string;
    nbf: number;
    role: string | string[];
    sub: string;
    unique_name: string;
}

export class JwtHelper {

    public getToken(): IJwt {
        var cookie: string = Cookie.getCookie("token");
        if (cookie && !this.isTokenExpired(cookie)) {
            return JSON.parse(cookie);
        }
        return;
    }

    public getRoles(rawToken: string): string[] {
        var decoded: IJwtBody = this.decodeToken(rawToken);
        if (!decoded) {
            return;
        }
        if (Array.isArray(decoded.role)) {
            return <string[]>decoded.role;
        }
        else {
            return [<string>decoded.role];
        }
    }

    public setToken(token: IJwt, rememberMe: boolean): void {
        Cookie.setCookie("token", JSON.stringify(token), rememberMe ? token.expires_in : undefined);
    }

    public urlBase64Decode(str: string): string {
        var output: string = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            default:
                throw "Illegal base64url string!";
        }

        return decodeURIComponent(escape(window.atob(output))); //polifyll https://github.com/davidchambers/Base64.js
    }

    public decodeToken(token: string): IJwtBody {
        var parts: string[] = token.split(".");

        if (parts.length !== 3) {
            throw new Error("JWT must have 3 parts");
        }

        var decoded: string = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error("Cannot decode the token");
        }

        return JSON.parse(decoded);
    }

    public getTokenExpirationDate(token: string): Date {
        var decoded: any;
        decoded = this.decodeToken(token);

        if (typeof decoded.exp === "undefined") {
            return undefined;
        }

        var date: Date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);

        return date;
    }

    public isTokenExpired(token: string, offsetSeconds?: number): boolean {
        if (!token) {
            return true;
        }

        var date: Date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (!date) {
            return false;
        }

        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }

    public logout() {
        Cookie.deleteCookie("token");
    }
}
