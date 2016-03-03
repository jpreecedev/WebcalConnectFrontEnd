import {IJwt} from "./Jwt";
import {Cookie} from "./cookies";

declare var escape: any;

export class JwtHelper {

    public getToken(): IJwt {
        var cookie: string = Cookie.getCookie("token");
        if (cookie && !this.isTokenExpired(cookie)) {
            return JSON.parse(cookie);
        }
        return undefined;
    }

    public getRoles(): string[] {
        var cookie: string = Cookie.getCookie("roles");
        if (cookie) {
            return JSON.parse(cookie);
        }
        return undefined;
    }

    public setToken(token: IJwt, rememberMe: boolean): void {
        Cookie.setCookie("token", JSON.stringify(token), rememberMe ? token.expires_in : undefined);
    }

    public setRoles(roles: string[]): void {
        Cookie.setCookie("roles", JSON.stringify(roles));
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

    public decodeToken(token: string): any {
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
}
