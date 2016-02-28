import {License} from "./license";

export interface Client {
    name: string;
    expiration: string;
    accessId: string;
    licenses: License[];
}