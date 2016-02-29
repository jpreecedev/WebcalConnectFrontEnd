import {Pipe} from "angular2/core";
import {Client} from "./client";

@Pipe({
    name: "clientName"
})
export class ClientNamePipe {
    transform(data: Client[], filterValue: any) {
        if (!data || !filterValue[0]) {
            return data;
        }
        return data.filter((item: Client) => {
            return item.name && item.name.toLowerCase().indexOf(filterValue[0].toLowerCase()) > -1;
        });
    }
}