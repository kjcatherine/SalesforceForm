import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createPhysicianRegistration from '@salesforce/apex/PhysicianFormController.createPhysicianRegistration';
import logo from '@salesforce/resourceUrl/ABC_Logo';
import backgroundImage from '@salesforce/resourceUrl/partners_background';

export default class PhysicianForm extends LightningElement {
    @track currentStep = 'provider';
    @track formData = {
        FirstName: '',
        LastName: '',
        NPI: '',
        Email: '',
        CellPhone: '',
        PracticeName: '',
        PracticePhone: '',
        PracticeEmail: '',
        StreetAddress: '',
        City: '',
        State: '',
        Zip: '',
        Country: ''
    };

    logoUrl = logo;
    backgroundUrl = backgroundImage;

    get isProviderStep() {
        return this.currentStep === 'provider';
    }

    get isPracticeStep() {
        return this.currentStep === 'practice';
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        let value = event.target.value;

        if (field === 'Zip') {
            value = value ? parseFloat(value) : null;
        }

        this.formData[field] = value;
        console.log('Input changed:', field, value);
    }

    handleAddressChange(event) {
        const addressFields = event.detail;
        this.formData.StreetAddress = addressFields.street;
        this.formData.City = addressFields.city;
        this.formData.State = addressFields.province;
        this.formData.Zip = addressFields.postalCode ? parseFloat(addressFields.postalCode) : null;
        this.formData.Country = addressFields.country;
    }

    handleClick(event) {
        const buttonId = event.target.dataset.id;
        console.log('Button clicked:', buttonId);

        if (buttonId === 'nextButton') {
            this.goToPracticeInfo();
        } else if (buttonId === 'previousButton') {
            this.goToProviderInfo();
        } else if (buttonId === 'submitButton') {
            this.handleSubmit();
        }
    }

    goToPracticeInfo() {
        this.currentStep = 'practice';
    }

    goToProviderInfo() {
        this.currentStep = 'provider';
    }

    handleSubmit() {
        if (this.validateForm()) {
            console.log('Form data:', JSON.stringify(this.formData));
            
            createPhysicianRegistration({ formData: JSON.stringify(this.formData) })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Physician Registration created',
                            variant: 'success'
                        })
                    );
                    this.resetForm();
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        }
    }

    validateForm() {
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-input-address')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);

        if (!allValid) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill all required fields correctly.',
                    variant: 'error'
                })
            );
        }

        return allValid;
    }

    resetForm() {
        this.formData = {
            FirstName: '',
            LastName: '',
            NPI: '',
            Email: '',
            CellPhone: '',
            PracticeName: '',
            PracticePhone: '',
            PracticeEmail: '',
            StreetAddress: '',
            City: '',
            State: '',
            Zip: '',
            Country: ''
        };
        this.currentStep = 'provider';
        this.template.querySelectorAll('lightning-input, lightning-input-address').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = null;
            }
        });
    }
}


