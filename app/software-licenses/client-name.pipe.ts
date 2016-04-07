import {Pipe, PipeTransform} from "angular2/core";
import {Client} from "./software-licenses.component";

@Pipe({
    name: "clientName"
})
export class ClientNamePipe implements PipeTransform {
    public transform(data: Client[], filterValue: any): Client[] {
        if (!data || !filterValue[0]) {
            return data;
        }
        return data.filter((item: Client) => {
            return item.name && item.name.toLowerCase().indexOf(filterValue[0].toLowerCase()) > -1;
        });
    }
}
