@isTest
private class bfPath_Controller_Test {
    static testMethod void unitTest1() {
        Map<String, RecordTypeInfo> pRecordTypes = Schema.SObjectType.Product__c.getRecordTypeInfosByName();
        String rtWetGoods = pRecordTypes.get('Wet Goods').getRecordTypeId();

        Market__c mAU = new Market__c();
        mAU.Name = 'Australia';
        mAU.Vistex_Clearing_Account__c = '0123456789';
        mAU.Country_ISO_Code_2__c = 'AU';
        mAU.Country_ISO_Code_3__c = 'AUS';
        insert mAU;

		Product__c p = new Product__c();
        p.Name = 'test Product 1';
        p.Market__c = mAU.Id;
        p.RecordTypeId = rtWetGoods;
        insert p;

        Map<String, Object> result = bfPath_Controller.getRecordDetails(mAU.Id, 'Country_ISO_Code_2__c');
        System.assertEquals('SUCCESS', result.get('status'));
        System.assertNotEquals(null, result.get('data'));

        result = bfPath_Controller.getRecordDetails(p.Id, 'Market__c');
        System.assertEquals('SUCCESS', result.get('status'));
        System.assertNotEquals(null, result.get('data'));
        
        try {
            // next call should throw duplicate field in query exception
	        result = bfPath_Controller.getRecordDetails(p.Id, 'Name');            
        }catch(Exception ex) {
            System.debug('exceptin caught');
        }
    }
}