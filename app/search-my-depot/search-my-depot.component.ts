import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../Jwt";

@Component({
    templateUrl: "app/search-my-depot/search-my-depot.component.html",
    styleUrls: ["app/search-my-depot/styles.css"],
})
@CanActivate(() => hasValidToken())
export class SearchMyDepotComponent {

}
