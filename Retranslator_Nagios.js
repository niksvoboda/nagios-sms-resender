const Log       = require("./utils/log.js");
const axios     = require('axios');
const config    = require("config");
const Utils     = require("./utils/Utils.js")


class RetranslatorNagios extends Log {

    name = "RetranslatorNagios";

    async sms(value, message){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;
        self.d(".sms");
        try {
            const password  = config.get('sms_gate.password_base_64')
            const url       = config.get('sms_gate.url') 
            const systemID  = config.get('sms_gate.systemID')  
            const naming    = config.get('sms_gate.naming')                     
            const expiredTime = Utils.formatDateForSms(3600)
            const CreateDateTime = Utils.formatDateForSms(0)

            // Заголовки
            const req_config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CreateDateTime': CreateDateTime ,
                    'RequestID': '90100',
                    'X-From': 'smi',
                    'X-ServiceID': 'clintinfosend_01.00.00',
                    'Authorization': `Basic ${password}` // Подтягиваем из файла параметр auth_sms_gate.password_base_64 закодированный в base64 "Basic ..."
                }
            };
            // Тело запроса
            const data = {
            "meta": {
                "systemID": `"${systemID}"` // подтягиваем из конфига
            },
            "data": {
                "requestID": "ce10e70d-2223-4235-b21e-dbd023eec4d7", // генерим
                "orderId": "ce10e70d-2223-4235-b21e-dbd023eec4d7", // генерим
                "contactInfo": {
                "code": "contactPhoneClient", 
                "value": `"${value}"`  // парсим из входных данных
                },
                "priority": "realtime",
                "messageType": "sms",
                "expiredTime": `"${expiredTime}"`  , // ставим + 1 час к времени сервера в формате "2019-08-10T12:08:56.235+03:00"
                "message":  `"${message}"` , // парсим из входных данных
                "naming": `"${naming}"` 
            }
            };



        true && axios.post(url, data, req_config)  
                .then(response => {
                //  console.log(response.data)
                })
                .catch(error => {
                    console.error(error)
                });
            let response = {
                status:"ОК"
            }
            return response  
        } catch (error) {
            return error
        }        
    }
}

const self = new RetranslatorNagios();
module.exports = self;

