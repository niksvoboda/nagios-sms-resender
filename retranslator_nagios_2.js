const Log       = require("./utils/log.js");
const axios     = require('axios');
const config    = require("config");
const Utils     = require("./utils/Utils.js")

/** Генерим рандомную букву */
function getRandomLetter() {
    //Задаем буквы используемые в генерации
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    //Добавляем их прописные версии
    alphabet = alphabet + alphabet.toUpperCase()
    //Выбираем рандомную букву из строки
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }
/** Генерим рандомную цифру */
function getRandomDigit() {
    return Math.floor(Math.random() * 10);
  }
/** Генерим строку по шаблону */
function rand(templateString) {
     // Откатываем автоматическую конвертацию в число если на вход подана строка из цифр
    templateString = templateString +''
    let result = '';  
    for (const char of templateString) {
        // Проверка на цифру
      if (char >= '0' && char <= '9') { 
        result += getRandomDigit();
        // Проверка на букву
      } else if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) { 
        result += getRandomLetter();
      } else {
        // Если символ не буква и не цифра, просто добавляем его как есть(для дефисов)
        result += char;
      }
    }  
    return result;
  }

class RetranslatorNagios extends Log {   

    name = "RetranslatorNagios";
    async sms(value, message, typesend){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//        process.env.TLS_CERT_FILE = '/usr/local/share/ca-certificates/ldapp.cer';
//        process.env.NODE_EXTRA_CA_CERTS = '/usr/local/share/ca-certificates/ldapp.cer';
        self.d(".sms");
        try {
            const password  = config.get('sms_gate.password_base_64')
            const url       = config.get('sms_gate.url2')
            const systemID  = config.get('sms_gate.systemID')
            const naming    = config.get('sms_gate.naming')
            const sendid    = config.get('sms_gate.sendid')
            const expiredTime = Utils.formatDateForSms(3600)
            const CreateDateTime = Utils.formatDateForSms(0)

            // Заголовки
            const req_config = {
                headers: {
//Reservation field
//                    'MsgId': `${rand('1188BB88-4A4B-4444')}-pmon-${rand('1A1B12121212')}`, //заменить на генерацию по маске с pmon предпосл.
//                    'JMSReplyTo': 'OUT.RS.PUSHSMSCLIENT_02.00.00',
//                    'X-ReplyToQ': 'OUT.RS.PUSHSMSCLIENT_02.00.00',
//                    'JMSMessageID' : `${rand('1b1b1000-07f0-4ac3-9cd7-211109a48c06')}`,  //заменить на генерацию по маске
                    'X-Transaction_Id': `${rand('2288BB88-4A4B-4444')}-pmon-${rand('1A1B12121212')}`, //заменить на генерацию по маске с pmon предпосл.
                    'X-From': sendid,
                    'X-ServiceID': 'CLINTINFOSEND_02.00.00',
//                    'X_ServiceID': 'CLINTINFOSEND_02.00.00',
//                    'X-ServiceID': 'clintinfosend_02.00.00',
                    'X-ServiceLevel': '3',
                    'X-CreateDateTime': CreateDateTime,
                    'X-Version': '2.0',
                    'RequestID': `${rand('EE021b9c-6000-4f9c-993e-04d19bb4ftt1')}`, //заменить на генерацию по маске
                    'Authorization': `Basic ${password}`
                }
            };
            // Тело запроса
            const data = {
  "meta": {
    "systemId": systemID
  },
  "data": {
    "externalId": `${sendid}${rand('114499554466')}`, //заменить на генерацию по ВМЕСТО 114499554466
    "typeCode": typesend,
    "subject": naming,
    "address": value,
    "forceFl": "Y",
    "priority": "1",
    "text": message
   }
};
//console.log(url, data, req_config)

        true && axios.post(url, data, req_config)
                .then(response => {
                  console.log(response.data)
                })
                .catch(error => {
                    console.error(error)
                });
            let response = {
                status:"ОК"
            }
            return response
        } catch (error) {
            console.error(error)
        }
    }
}

const self = new RetranslatorNagios();
module.exports = self;
