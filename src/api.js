
var apikey, url, gate, startUrl, addOrderUrl, orderStatusUrl, balanceUrl;

async function inistializeConfig(){
    await getConfig().then(x => {
        var access = x.child('access');
        apikey = access.child('apikey').val();
        url = access.child('url').val();
        gate = access.child('gate').val();
        startUrl = url+gate+apikey;
        addOrderUrl = startUrl + access.child('addOrderUrl').val();
        orderStatusUrl = startUrl + access.child('orderStatusUrl').val();
        balanceUrl = startUrl + access.child('balanceUrl').val();
    });
}

async function getBalance(){
    return await inistializeConfig().then(async function(){
        return await $.ajax({
            type:"POST", 
            url: balanceUrl, 
            success: function(data) {
                //console.log("Res1: "+JSON.stringify(data));
                return data;
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                    //alert(jqXHR.status);
                    console.log("error " + errorThrown);
                },                
        }); 
    });
}

async function makeOrder(link, quantity, sid){
    var sid;
    return await inistializeConfig().then(async function(){
        return await $.ajax({
            type:"POST", 
            url: addOrderUrl + sid + "&link=" + link +"&quantity=" + quantity, 
            success: function(data) {
                    console.log("Res: "+JSON.stringify(data));
                    return data;
                }, 
            error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.status);
                    return false;
                },
        });
    });
}

async function getOrderStatus(oid){
    return await inistializeConfig().then(async function(){
        return await $.ajax({
            type:"POST", 
            url: orderStatusUrl + oid, 
            success: function(data) {
                    //console.log("Res: "+JSON.stringify(data));
                    //console.log("Res1: "+data);
                    return data;
                }, 
            error: function(jqXHR, textStatus, errorThrown) {
                    //alert(jqXHR.status);
                    return false;
                },
        });
    });
}

