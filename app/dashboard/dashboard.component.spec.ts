import {it, describe, expect, beforeEach, beforeEachProviders, inject, MockApplicationRef} from 'angular2/testing';
import {DashboardComponent} from './dashboard.component';
import {provide, ApplicationRef} from 'angular2/core';
import {RootRouter } from 'angular2/src/router/router';
import {Location, RouteParams, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT } from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {AppComponent} from '../app.component';

describe('Dashboard', () => {

    beforeEachProviders(() => {
        return [
            RouteRegistry,
            provide(Location, { useClass: SpyLocation }),
            provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent }),
            provide(Router, { useClass: RootRouter })
        ];
    });

    // it('Should define 6 dashboard items for standard user', inject([Router], (router: Router) => {
        // let dashboard = new DashboardComponent(router);
        // dashboard.ngOnInit();
        // expect(dashboard.dashboardItems).toBeDefined();
        // expect(dashboard.dashboardItems).length === 6;
    // }));
    
});
