function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function stringRepeat(str) {
    num = Math.floor(Math.random() * 5);
    num = Number(num);
    var result = '';
    while (true) {
        if (num & 1) { // (1)
            result += str;
        }
        num >>>= 1; // (2)
        if (num <= 0) 
            break;
        str += str;
    }
    //console.log("result: " + result + "len: " + result.length)
    return result;
}

function getDate(){
    return new Date().toLocaleDateString();
}
function getTime(){
    //return new Date().toLocaleTimeString();
    return new Date().toLocaleTimeString('en-US', { hour12: false, 
        hour: "numeric", 
        minute: "numeric"});
}

function getDateAndTime(){
    return new Date().toLocaleString();
}

function checkDate(str) {
    
    end = getDate().split("/");

    str = str.split("/");

    var year = str[2];
    var month = str[1];
    var date = str[0];
    
    
    var endYear = end[2];
    var endMonth = end[1];
    var endDate = end[0];
    
    var last_date = new Date(year, month-1, date);
    var today = new Date(endYear, endMonth-1, endDate);
       
    
    if (today > last_date) {
        return true;
    } else {
        return false;
    }
}

function randomNo(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomMin() { 
    return Math.round((Math.random()*(200-30)+30)/30)*30;
}

function checkNull(item){
 if(item != null){
    return true;
 } else{
    return false;
 }
}

