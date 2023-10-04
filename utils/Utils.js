const Log       = require("./log.js");

class Utils extends Log {
    name = 'Utils'
    /*
    Этот код сначала берет текущую дату и время и преобразует их в ISO формат с помощью метода Date.toISOString(). 
    Затем он удаляет 'Z' из строки и добавляет смещение часового пояса сервера с помощью функции getServerTimezoneOffset.
    Функция getServerTimezoneOffset извлекает смещение времени для текущей даты и возвращает его как строку в формате "+HH:MM" или "-HH:MM". 
    Знак + используется, если часовой пояс впереди UTC, и - - если он позади.
    */
    formatDateForSms(add_seconds){
        self.d(".formatDateForSms");
        
        const date = new Date();
        const futureDate = new Date(date.getTime() + add_seconds * 1000); // добавляем add_seconds секунд, умножаем на 1000 для перевода в миллисекунды
        const formattedFutureDate = futureDate.toISOString().replace('Z', '') + getServerTimezoneOffset(futureDate);
        
        console.log(formattedFutureDate);
        
        function getServerTimezoneOffset(date) {
            const sign = (date.getTimezoneOffset() > 0) ? "-" : "+";
            const offset = Math.abs(date.getTimezoneOffset());
            const hours = padZeroLeft(Math.floor(offset / 60));
            const minutes = padZeroLeft(offset % 60);
            return sign + hours + ":" + minutes;
        }
        
        function padZeroLeft(number) {
            return (number < 10 ? '0' : '') + number;
        }

        return formattedFutureDate
    }
}
    
const self = new Utils();
module.exports = self;