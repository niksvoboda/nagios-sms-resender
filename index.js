const RetranslatorNagios = require('./Retranslator_Nagios')

/**
Аргументы прилетают в виде массива, где 4 - элемент строка с сообщением, 5 - строка содержащая номер получателя, разбиваем ее по @  
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\Administrator\\Documents\\GitHub\\nagios-sms-resender\\index.js',
  "'Dopkov'",
  'C',
  "'Warning'",
  "`''89859075646@*NagiosXI*:HOSTNAME:SERVICE-Web=NOTIFICATIONTYPE(SERVICESTATE):SERVICEOUTPUT:LONGSERVICEOUTPUT:SHORTDATETIME`"
]
 */

/** Получаем сообщение */
let message = process.argv[4]
/** Чистим строку от разных видов ковычек (флаг -g все вхождения) */
message = message.replace(/['`"]/g, '');
/** Получаем строку с номером телефона */
let value = process.argv[5]
/** Чистим строку от разных видов ковычек (флаг -g все вхождения) */
value = value.replace(/['`"]/g, '');
/** Доставем номер */
value = value.split('@')[0]
console.log(value);

RetranslatorNagios.sms(value, message);

