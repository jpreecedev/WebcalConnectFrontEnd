import {it, describe, expect, beforeEach, beforeEachProviders, inject} from 'angular2/testing';
import {provide, ApplicationRef} from 'angular2/core';
import {BaseRequestOptions, Http, XHRBackend, Response, ResponseOptions, HTTP_PROVIDERS} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {CalibrationsDueComponent} from './calibrations-due.component';
import {CalibrationsDueService} from './calibrations-due.service';
import {AppComponent} from '../app.component';

describe('Calibrations Due Component', () => {

    beforeEachProviders(() => [
        provide(XHRBackend, { useClass: MockBackend }),
        provide(CalibrationsDueService, {
            deps: [HTTP_PROVIDERS]
        }),
        BaseRequestOptions,
        MockBackend,
        provide(Http, {
            useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        })
    ]);

    beforeEach(inject([MockBackend], (backend: MockBackend) => {
        const baseResponse = new Response(new ResponseOptions({ body: 'got response' }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
    }));


    it('Blah', inject([CalibrationsDueService, Http], (service: CalibrationsDueService, http: Http) => {
        // let calibrationsDueComponent = new CalibrationsDueComponent(service, http);
        // calibrationsDueComponent.ngOnInit();
        // expect(calibrationsDueComponent.calibrationsDue).toBeDefined();
    }));

});
