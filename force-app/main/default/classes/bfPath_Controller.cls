/**
 * Test class:  bfPath_Controller_Test
 */
public with sharing class bfPath_Controller {
    @AuraEnabled
    public static Map<String, Object> getRecordDetails(String recordId, String fieldName){
        Map<String, Object> result = new Map<String, Object>();

        try {
            Id theId = Id.valueOf(recordId);
            Schema.SObjectType typeOfObj = theId.getSobjectType();
            Schema.DescribeSObjectResult dsr = typeOfObj.getDescribe();
            Map<String, Schema.SObjectField> fields = dsr.fields.getMap();
            
            String soql = 'SELECT Id, Name ';
            if (fields.containsKey('RecordTypeId')) {
                soql += ', RecordTypeId, RecordType.Name';
            }
            if (fields.containsKey(fieldName)) {
                soql += ', ' + fieldName;
            }
            soql += ' FROM ' + dsr.getName();
            soql += ' WHERE Id =:recordId';

            List<SObject> data = Database.query(soql);
            SObject theRecord;
            if (data != null && data.size() > 0) {
                theRecord = data.get(0);
            }
            
            result.put('status', 'SUCCESS');
            result.put('data', theRecord);
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }

        return result;
    }

}
