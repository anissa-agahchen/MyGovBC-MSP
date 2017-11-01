import {Component, Inject, ViewChild} from '@angular/core';
import {MspProgressBarItem} from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import {ProcessService,ProcessStep,ProcessUrls} from "../service/process.service";
import {MspAccountApp} from '../model/account.model';
import {ProgressBarHelper} from './ProgressBarHelper';
import {MspDataService} from '../service/msp-data.service';
import { environment } from '../../../../environments/environment';

require('./account.component.less');

/**
 * Account for MSP
 */
@Component({
    templateUrl: './account.component.html'
})

export class AccountComponent {

    lang = require('./i18n');


    @ViewChild('progressBar') progressBar: MspProgressBarComponent;

    constructor(private processService: ProcessService, private dataService: MspDataService) {
        environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    get accountProgressBarList(): Array<MspProgressBarItem> {

        if (this.processService.process == null ||
            this.processService.process.processSteps == null) {
            this.initProcessService();
        }

        if (!this.dataService.getMspProgressBar()) {
            this.generateProgressBarItems();
        }

        return this.dataService.getMspProgressBar();


    };


    private generateProgressBarItems() {
        var newProgressBarItems: MspProgressBarItem[] = [];
        // let customHeight: Object = {'height': '60px'};

        // let widthMainMenu: Object = {};
        // let widthPersonalInfo: Object = {};
        // let widthDependents: Object = {};
        // let widthDocumentUpload: Object = {};
        // let widthReview: Object = {};

        if (this.dataService.getMspAccountApp()) {
            const accountChangeOptions = this.dataService.getMspAccountApp().accountChangeOptions;
            const progressBarHelper: ProgressBarHelper = new ProgressBarHelper(this.dataService.getMspAccountApp().accountChangeOptions);

            // customHeight = progressBarHelper.height;

            // widthMainMenu = progressBarHelper.widthMainMenu;

            // widthPersonalInfo = progressBarHelper.widthPersonalInfo;
            // widthDependents = progressBarHelper.widthDependents;

            // widthDocumentUpload = progressBarHelper.widthDocumentUpload;
            // widthReview = progressBarHelper.widthWidthReview;

            if (accountChangeOptions.hasAnyPISelected()) {
                // newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.personalInfoLabel, ProcessUrls.ACCOUNT_PERSONAL_INFO_URL, customHeight,widthPersonalInfo));
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.personalInfoLabel, ProcessUrls.ACCOUNT_PERSONAL_INFO_URL));
                //TODO - i18n
                // newProgressBarItems.push(new MspProgressBarItem('Update/Correct Personal Information', ProcessUrls.ACCOUNT_PERSONAL_INFO_URL));
            }

            if (accountChangeOptions.dependentChange) {
                // newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.dependentsLabel, ProcessUrls.ACCOUNT_DEPENDENTS_URL, customHeight,widthDependents));
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.dependentsLabel, ProcessUrls.ACCOUNT_DEPENDENTS_URL));
                //TODO - i18n
                // newProgressBarItems.push(new MspProgressBarItem('Add/Remove Spouse and/or Child(ren)', ProcessUrls.ACCOUNT_DEPENDENTS_URL));
            }
        


        }


        let progressBar: MspProgressBarItem[] = [
            // new MspProgressBarItem(this.lang("./en/index.js").progressStepMainMenu, this.processService.process.processSteps[0].route, customHeight, widthMainMenu),
            // new MspProgressBarItem(this.lang("./en/index.js").progressStepDocumentation,  ProcessUrls.ACCOUNT_FILE_UPLOADER_URL, customHeight, widthDocumentUpload),
            // new MspProgressBarItem(this.lang("./en/index.js").progressStepReview, ProcessUrls.ACCOUNT_REVIEW_URL, customHeight ,widthReview),
            new MspProgressBarItem(this.lang("./en/index.js").progressStepMainMenu, this.processService.process.processSteps[0].route),
            new MspProgressBarItem(this.lang("./en/index.js").progressStepDocumentation,  ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
            new MspProgressBarItem(this.lang("./en/index.js").progressStepReview, ProcessUrls.ACCOUNT_REVIEW_URL),
        ];

        
        if (newProgressBarItems && newProgressBarItems.length > 0) {
            progressBar.splice(1, 0, ...newProgressBarItems);
        }
        console.log('AccountComponent, end of generateProgressBarItems', progressBar);

        this.dataService.seMspProgressBar(progressBar);
    }


    /**
     * Sets ProcessService to the static incomplete state ready to be configured
     * by AccountPrepareComponent as long as ProcessService has not already been
     * configured by AccountPrepareComponent.  The static incomplete state does
     * NOT include the dynamic options, like AccountDependentChangeComponent,
     * which the user selects at runtime via AccountPrepareComponent.
     * 
     * ProcessService is stored in LocalStorage and persists through refreshes.
     * 
     */
    private initProcessService() {

        // Ensure that ProcessService isn't already configured for Account
        if (this.processService.process === null
            || this.processService.getStepNumber(ProcessUrls.ACCOUNT_PREPARE_URL) >= 0) {

            this.processService.init([
                new ProcessStep(ProcessUrls.ACCOUNT_PREPARE_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_REVIEW_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_SENDING_URL)
            ]);
        }
    }


}