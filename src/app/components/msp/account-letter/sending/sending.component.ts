import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {MspDataService} from '../../service/msp-data.service';
import {MspACLService} from '../../service/msp-acl-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../api-model/responseTypes';
import {MspLogService} from '../../service/log.service';
import {ProcessService} from '../../service/process.service';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface';
import {AccountLetterApplication} from '../../model/account-letter-application.model';
import {AccountLetterType} from '../../api-model/accountLetterTypes';
import {ACLApiResponse} from '../../model/account-letter-response.interface';


@Component({
    templateUrl: 'sending.component.html',
    styleUrls: ['./sending.component.scss']
})

@Injectable()
export class AccountLetterSendingComponent implements AfterContentInit {
    lang = require('./i18n');

    application: AccountLetterApplication;
  //  public rawError: string;
    rawRequest: string;
    transmissionInProcess: boolean;
    hasError: boolean;
    aclApiResponse: ACLApiResponse;


    constructor(private aclService: MspACLService, private dataService: MspDataService, private processService: ProcessService,
                public router: Router, private logService: MspLogService) {
        this.application = this.dataService.accountLetterApp;
        this.transmissionInProcess = undefined;
        this.hasError = undefined;
    }

    /**
     * always regnerate uuid for application and its images
     * When user use browser back button, the uuid are guaranteed to be unique for API server.
     */
    ngAfterContentInit() {
        this.transmitApplication();
    }

    transmitApplication() {
        // After view inits, begin sending the application
        this.transmissionInProcess = true;
        this.hasError = undefined;
        this.logService.log({name: 'account-letter application submitting request', url: this.router.url}, "account-letter : Submission Request");

        this.aclService
            .sendAccountLetterApp(this.application, this.application.uuid)
            .subscribe(response => {
                if (response instanceof HttpErrorResponse) { // probable network errors..middleware could be down
                    this.logService.log({
                        name: 'account-letter - System Error',
                        url: this.router.url,
                        ApplicationID: this.application.uuid
                    }, 'account-letter - Submission Response Error' + response.message);
                    this.processErrorResponse(response, response.message, false);
                    return;
                }
                // business errors.. Might be either a RAPID validation failure or DB error
                this.aclApiResponse = <ACLApiResponse> response;
                if (this.isFailure(this.aclApiResponse)) {
                    this.logService.log({
                        name: 'account-letter - RAPID/DB Error',
                        url: this.router.url
                    }, 'account-letter - Submission Response Error' + JSON.stringify(this.aclApiResponse));
                    this.processErrorResponse(response, undefined ,true);
                    return;
                } else {
                    //delete the application from storage
                    const refNumber = this.aclApiResponse.referenceNumber;
                    this.logService.log({
                        name: 'account-letter - Received refNo ',
                        url: this.router.url,
                        confirmationNumber: refNumber
                    }, 'account-letter - Submission Response Success');
                    this.dataService.removeMspAccountLetterApp();
                    this.router.navigate(['/msp/account-letter/confirmation'],
                        {queryParams: {confirmationNum: refNumber}});
                        
                }
            });
    }

    retrySubmission() {
        this.router.navigate(['/msp/account-letter/personal-info']);
    }

    // if there is a RAPID_ERROD code , show the spinner till SPA_ENV server reponse is fetched
    stopProcessing() {
        this.transmissionInProcess = false;
    }

    processErrorResponse(response: HttpErrorResponse, errorMessage: string , transmissionInProcess: boolean) {
        console.log('Error Response :' + response);
       // this.rawError = (errorMessage != null && errorMessage != 'undefined') ? errorMessage : undefined;
        this.hasError = true;
        this.transmissionInProcess = transmissionInProcess;
        const oldUUID = this.application.uuid;
        this.application.regenUUID();
        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);
        this.application.authorizationToken = null;
        this.dataService.saveAccountLetterApplication();

    }
    /*
    Handle all the failure conditions here
     */
    isFailure(aCLApiResponse: ACLApiResponse):boolean {
        // has a reference number , is DB error code Y , is RAPID response Y then its not a failure
        if (aCLApiResponse.referenceNumber && aCLApiResponse.dberrorCode ==='Y'  && aCLApiResponse.rapidResponse ==='Y' ) {
            return false;
        }

        return true;
    }
}
