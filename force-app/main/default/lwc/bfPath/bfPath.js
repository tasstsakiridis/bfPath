import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

import getRecordDetails from '@salesforce/apex/bfPath_Controller.getRecordDetails';

import CONFETTI_JS from '@salesforce/resourceUrl/confetti';
import { basicCannon, randomCannon, fireworks } from 'c/confettiLib';

export default class BfPath extends LightningElement {
    @api 
    recordId;

    @api 
    objectName = '';

    @api 
    fieldName = '';

    @api 
    stepValues = '';

    @api 
    stepLabels = '';

    @api
    usePicklistValues;

    @api 
    celebrateStep;

    @api 
    celebrationType;

    @api 
    showConfettiActions = false;

    steps;
    error;
    currentStep = 'New';
    _objectInfo;
    @wire(getObjectInfo, { objectApiName: '$objectName' })
    getWiredObjectInfo({error, data}) {
        console.log('[bfPath.getObjectInfo] data',data);
        console.log('[bfPath.getObjectInfo] error',error);
        if (data) {
            this.error = undefined;
            this._objectInfo = data;
        } else if (error) {
            this.error = error;
        }
    };

    _picklistValues;
    @wire(getPicklistValuesByRecordType, { objectApiName: '$objectName', recordTypeId: '$recordTypeId'})
    getWiredPicklistValues({error, data}) {
        console.log('[bfPath.getPicklistValues] error', error);
        console.log('[bfPath.getPicklistValues] data', data);
        if (data) {
            this.error = undefined;
            this._picklistValues = data;
            console.log('[bfPath.getPicklistValues] usePicklistvalues', this.usePicklistValues);
            console.log('[bfPath.getPicklistValues] fieldName', this.fieldName);
            if (this.usePicklistValues && this.fieldName != '') {
                console.log('[bfPath.getPicklistValues] values', data.picklistFieldValues[this.fieldName]);
                this.steps = [...data.picklistFieldValues[this.fieldName].values];
            }
        } else if (error) {
            this.error = error;
        }
    }

    _theRecord;
    recordTypeId;

    _confettiLoaded;
    renderedCallback() {
        if (this._confettiLoaded) {
            return;
        }
        this._confettiLoaded = true;
        Promise.all([loadScript(this, CONFETTI_JS)])
        .then(() => {
            this.setupCanvas();
        })
        .catch(error => {
            console.log('[bfPath.loadScript] exception', error);
        })
    }

    connectedCallback() {

        if (!this.usePicklistValues && this.stepValues != undefined) {
            const theSteps = [];
            const theStepValues = this.stepValues.split(',');
            const theStepLabels = this.stepLabels.split(',');
            let lbl, val = '';
            for(var i = 0; i < theStepValues.length; i++) {
                val = theStepValues[i];
                if (i < theStepLabels.length) {
                    lbl = theStepLabels[i];
                } else {
                    lbl = val;
                }
                theSteps.push({label: lbl, value: val});
            }

            this.steps = [...theSteps];
        }
        getRecordDetails({recordId: this.recordId, fieldName: this.fieldName})
        .then(result => {
            console.log('[bfPath.getRecordDetails] result', result);
            this._theRecord = result.data;
            if (result.data.RecordTypeId != undefined) {
                this.recordTypeId = result.data.RecordTypeId;
            }
            console.log('[bfPath.getRecordDetails] recordTypeId', this.recordTypeId);
            this.currentStep = result.data[this.fieldName];
            console.log('[bfPath.getRecordDetails] currentStep', this.currentStep);
            console.log('[bfPath.getRecordDetails] steps', this.steps);
        })
        .catch(error => {
            this.error = error;
            console.log('[bfPath.getRecordDetails] error', error);
        });    
    }

    setupCanvas() {
        console.log('[bfPath.setupCanvas] confetti', confetti);
        var confettiCanvas = this.template.querySelector("canvas.confettiCanvas");
        this.myConfetti = confetti.create(confettiCanvas, { resize: false });
        this.myConfetti({
            zIndex: 10000
        });
    }

    handleStepBlue(event) {
        const stepIndex = event.detail.index;
    }
    handleBasicConfetti() {
        basicCannon();
    }
    handleRandomConfetti() {
        randomCannon();
    }
    handleFireworksConfetti() {
        fireworks();
    }
}