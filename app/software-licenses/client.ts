import {License} from "./license";

export interface Client {
    clientId: string;
    clientName: string;
    licenses : License[];
}