require('dotenv').config();
var admin = require("firebase-admin");

var serviceAccount = process.env.MY_CREDENTIALS;
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: process.env.DB_URL
});

var database = admin.database();

async function getConfig(){
    const ref = database.ref('config');
    return await ref.once('value').then(x=> {return x; }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("error: "+errorMessage);
        return false;
    });
}

async function queryUser(uid){
    const ref = database.ref('users/');
    return await ref.once("value")
    .then(function(snapshot) {
        if(snapshot.child(uid.toString()).exists()){
            return snapshot.child(uid.toString()); 
        }
        else{
            return false;
        }
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
    });
}

async function queryUserBalance(uid){
    const ref = database.ref('users/');
    return await ref.once("value")
    .then(function(snapshot) {
        if(snapshot.child(uid.toString()).exists()){
            return snapshot.child(uid+"/balance").val();
        }
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
    });
}

async function queryDailyBalance(uid){
    const ref = database.ref('users/');
    return await ref.once("value")
    .then(function(snapshot) {
        if(snapshot.child(uid.toString()).exists()){
            var total = parseInt(snapshot.child(uid+"/balance").val());
            var limit = parseInt(snapshot.child(uid+"/usage/limit").val());
            var count = parseInt(snapshot.child(uid+"/usage/count").val());
            var balance;
            if(total > limit){
                balance = limit - count;
            }
            if (total == 0){
                balance = 0;
            }
			if(total < limit){
                balance = total - count;
            }
            return balance;
        }
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
    });
}

async function queryUserLimit(uid){
    const ref = database.ref('users/'+uid+'/');
    return await ref.once("value")
    .then(function(snapshot) {
        if(snapshot.child('usage').exists()){
            return snapshot.child("usage/limit").val();
        }
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
    });
}

async function updateUser(uid, data){
    const ref = database.ref('users/');
    const user = ref.child(uid);
    return await user.update(data).then(x=> {
        return true;
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
      });
}

async function updateLimit(uid, data){
    const ref = database.ref('users/'+uid+'/');
    const user = ref.child('usage');
    return await user.update(data).then(x=> {
        return true;
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
      });
}

async function updateUserBalance(uid){
    const ref = database.ref('users/');
    const user = ref.child(uid);
    const b = user.child('balance');
    b.transaction(function(currentClicks) {
        return (currentClicks || 0) - 1;
    });
}

async function checkLimit(uid){
    const ref = database.ref('users/'+uid+'/');
    const usage = ref.child('usage');
    return await usage.once("value")
    .then(function(snapshot) {
        if(snapshot.child('count').exists() == true){
            if(snapshot.child('count').val() != '0'){
                var count = snapshot.child('count').val();
                var date = snapshot.child('last_used_date').val();
                var limit = snapshot.child('limit').val();
                //if have trys left
                if(parseInt(count) < parseInt(limit)){
                    return true;
                }
                if((parseInt(count) == parseInt(limit)) && (checkDate(date.toString()) == true)){
                    return true;
                }
                else{
                    console.log('zero');
                    return 'zero';
                }
            }
        }
    });
}
async function updateCount(uid){
    const ref = database.ref('users/'+uid+'/');
    const usage = ref.child('usage');
    return await usage.once("value")
    .then(function(snapshot) {
        if(snapshot.child('count').exists() == true){
            var data, update_count;
            if(snapshot.child('count').val() == '0'){
                update_count = 1;
                data = {'count': update_count, 'last_used_date': getDate()}
                return usage.update(data).then(x=> {
                    return true;
                }).catch(error => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    return false;
                });
            } else{
                var count = snapshot.child('count').val();
                var date = snapshot.child('last_used_date').val();
                var limit = snapshot.child('limit').val();

                //if have trys left
                if(parseInt(count) < parseInt(limit)){
                    update_count = (parseInt(count)+1).toString();
                    data = {'count': update_count, 'last_used_date': getDate()}
                    return usage.update(data).then(x=> {
                        return true;
                    }).catch(error => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        return false;
                    });
                }
                if((parseInt(count) == parseInt(limit)) && (checkDate(date.toString()) == true)){
                    update_count = '1';
                    data = {'count': update_count, 'last_used_date': getDate()}
                    return usage.update(data).then(x=> {
                        return true;
                    }).catch(error => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        return false;
                    });
                }
                
            }
        }
        else{
            return false;            
        }
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('exists error ' + errorMessage);
        return false;
    });  
}

async function addOrder(orderid, uid, quantity, sid, link, date, time, status){
    const statRef = database.ref('orders/'+uid);
    return await statRef.child(orderid).set({
        uid: uid,
        orderid: orderid,
        quantity: quantity,
        sid: sid,
        link: link,
        date: date,
        time: time,
        status: status
    }).then(x=> {
        return true;
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
      });
}


function getStat(callback){
    var val;
    const statRef = database.ref('orders/');
    statRef.on('value', function (dataSnapshot) {
        val = dataSnapshot.val();
        callback(dataSnapshot);
    }, function (errorObject) {
        // code to handle read error
        console.log("The read failed: " + errorObject.code);
    });
}

function getOrders(id, callback){
    var val;
    const statRef = database.ref('orders/'+id);
    statRef.on('value', function (dataSnapshot) {
        val = dataSnapshot.val();
        callback(dataSnapshot);
    }, function (errorObject) {
        // code to handle read error
        console.log("The read failed: " + errorObject.code);
    });
}

async function updateOrderStatus(uid, oid, data){
    const ref = database.ref('orders/'+uid+'/');
    const order = ref.child(oid);
    return await order.update(data).then(x=> {
        return true;
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false;
      });
}


