import {Directive, Attribute, ElementRef, DynamicComponentLoader} from "angular2/core";
import {Router, RouterOutlet, ComponentInstruction} from "angular2/router";
import {hasValidToken} from "../Jwt";
import {Route, Routes} from "../../app.component";

@Directive({
    selector: "auth-router-outlet"
})
export class AuthRouterOutlet extends RouterOutlet {
    private parentRouter: Router;

    constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader, _parentRouter: Router, @Attribute("name") nameAttr: string) {
        super(_elementRef, _loader, _parentRouter, nameAttr);

        this.parentRouter = _parentRouter;
    }

    activate(instruction: ComponentInstruction): Promise<any> {
        var route = this.findRoute("/" + instruction.urlPath);
        if (!route){
            this.parentRouter.navigate(["Home"]);
            return;
        }
        
        if (route.role && !hasValidToken()) {
            this.parentRouter.navigate(["Login"]);
            return;
        }
        return super.activate(instruction);
    }

    findRoute(url: string): Route {
        if (!url || url === "/"){
            return null;
        }
        
        for (var index = 0; index < Routes.length; index++) {

        }
        
        return null;
    }
}
