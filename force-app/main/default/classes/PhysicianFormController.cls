public with sharing class PhysicianFormController {
    @AuraEnabled
    public static void createPhysicianRegistration(String formData) {
        try {
            Map<String, Object> formMap = (Map<String, Object>) JSON.deserializeUntyped(formData);

            // Map of country names to picklist values
            Map<String, String> countryMap = new Map<String, String>{
                'United States' => 'US'
            };

            String countryValue = (String)formMap.get('Country');
            String mappedCountryValue = countryMap.containsKey(countryValue) ? countryMap.get(countryValue) : countryValue;

            Physician_Registration_Form__c newForm = new Physician_Registration_Form__c(
                Provider_Name__c = (String)formMap.get('FirstName'),
                Provider_Last_Name__c = (String)formMap.get('LastName'),
                Provider_NPI__c = (String)formMap.get('NPI'),
                Provider_Email__c = (String)formMap.get('Email'),
                Provider_Cell_Phone__c = (String)formMap.get('CellPhone'),
                Practice_Name__c = (String)formMap.get('PracticeName'),
                Practice_Email__c = (String)formMap.get('PracticeEmail'),
                Practice_Phone__c = (String)formMap.get('PracticePhone'),
                Fax__c = (String)formMap.get('FaxNumber'),
                Practice_Address__Street__s = (String)formMap.get('StreetAddress'),
                Practice_Address__City__s = (String)formMap.get('City'),
                Practice_Address__StateCode__s = (String)formMap.get('State'),
                Practice_Address__PostalCode__s = String.valueOf(formMap.get('Zip')),
                Practice_Address__CountryCode__s = mappedCountryValue
            );

            insert newForm;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating Physician Registration: ' + e.getMessage());
        }
    }
}


/*public with sharing class PhysicianFormController {
    @AuraEnabled
    public static void createPhysicianRegistration(String formData) {
        try {
            Map<String, Object> formMap = (Map<String, Object>) JSON.deserializeUntyped(formData);
            
            Physician_Registration_Form__c newForm = new Physician_Registration_Form__c(
                Provider_Name__c = (String)formMap.get('FirstName'),
                Provider_Last_Name__c = (String)formMap.get('LastName'),
                Provider_NPI__c = formMap.get('NPI'),
                Provider_Email__c = (String)formMap.get('Email'),
                Provider_Cell_Phone__c = (String)formMap.get('CellPhone'),
                Practice_Name__c = (String)formMap.get('PracticeName'),
                Practice_Email__c = (String)formMap.get('PracticeEmail'),
                Practice_Phone__c = (String)formMap.get('PracticePhone'),
                Fax__c = (String)formMap.get('FaxNumber'),
                Practice_Address__Street__s = (String)formMap.get('StreetAddress'),
                Practice_Address__City__s = (String)formMap.get('City'),
                Practice_Address__StateCode__s = (String)formMap.get('State'),
                Practice_Address__PostalCode__s = formMap.get('Zip'),
                Practice_Address__CountryCode__s = (String)formMap.get('Country')
            );
            
            insert newForm;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating Physician Registration: ' + e.getMessage());
        }
    }
}*/