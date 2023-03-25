$('.container').hide();
$('.entry-content').hide();

const ipc = require('electron').ipcRenderer;

var uid, oid, time;
time = ~~(Math.random()*350);
var intervalStat, intervalAdj;

ipc.on('loadProgress', function(event, x) {
    console.log("data2 is:::::: " + x[0]+ ', '+x[1]);
    uid=x[0];
    oid=x[1];
});

fly=document.getElementById("fly");

outputConsole = document.querySelector(".output-console");


/* fake console stuff */
var commandStart = ['Performing search for', 
                'Searching ',  
                'Compressing ', 
                 'abtest-sg-tiktok.byteoversea.com新加坡',
                 'abtest-va-tiktok.byteoversea.com美国',
                 'gts.byteoversea.net美国',
                 'isnssdk.com',
                 'lf1-ttcdn-tos.pstatp.com',
                 'muscdn.com北京',
                 'musemuse.cn新加坡',
                 'musical.ly美国',
                 'p1-tt-ipv6.byteimg.com美国',
                 'p1-tt.byteimg.com',
                 'p16-ad-sg.ibyteimg.com',
                 'p16-tiktok-sg.ibyteimg.com北京',
                 'p16-tiktok-sign-va-h2.ibyteimg.com新加坡',
                 'p16-tiktok-va-h2.ibyteimg.com美国',
                 'p16-tiktok-va.ibyteimg.com美国',
                 'p16-va-tiktok.ibyteimg.com',
                 'p26-tt.byteimg.com',
                 'p3-tt-ipv6.byteimg.com北京',
                 'p9-tt.byteimg.com新加坡',
                 ],
    commandParts = ['TikTok Live', 
                    'TikTok .. Live',
                    ' .... Searching ... ', 
                    'pull-f3-hs.pstatp.com美国',
                    'pull-f5-hs.flive.pstatp.com美国',
                    'pull-f5-hs.pstatp.com',
                    'pull-f5-mus.pstatp.com',
                    'pull-flv-f1-hs.pstatp.com北京',
                    'pull-flv-f6-hs.pstatp.com新加坡',
                    'pull-flv-l1-hs.pstatp.com美国',
                    'pull-flv-l1-mus.pstatp.com美国',
                    'pull-flv-l6-hs.pstatp.com',
                    'pull-hls-l1-mus.pstatp.com',
                    'pull-l3-hs.pstatp.com北京',
                    'pull-rtmp-f1-hs.pstatp.com新加坡',
                    'pull-rtmp-f6-hs.pstatp.com美国',
                    'pull-rtmp-l1-hs.pstatp.com美国',
                    'pull-rtmp-l1-mus.pstatp.com',
                    'pull-rtmp-l6-hs.pstatp.com',
                    'quic-tiktok-core-proxy-i18n-gcpva.byteoversea.net北京',
                    'quic-tiktok-proxy-i18n-gcpva.byteoversea.net新加坡',
                    'sf1-ttcdn-tos.pstatp.com美国',
                    'sf16-ttcdn-tos.ipstatp.com美国',
                    'sf6-ttcdn-tos.pstatp.com',
                    'sgsnssdk.com',],
    commandResponses = ['Authorizing ', 
                 'Authorized...', 
                 'Access Granted..', 
                 'tiktok-lb-alisg.byteoversea.net北京',
                 'tiktok-lb-maliva.byteoversea.net新加坡',
                 'tiktok-platform-lb-alisg.byteoversea.net美国',
                 'tiktok.com美国',
                 'tiktokcdn-in.com',
                 'tiktokcdn-us.com',
                 'tiktokcdn-us.com.atomile.com北京',
                 'tiktokcdn.com新加坡',
                 'tiktokcdn.com.atomile.com美国',
                 'tiktokcdn.com.c.bytefcdn-oversea.com美国',
                 'tiktokcdn.com.c.bytetcdn.com',
                 'tiktokcdn.com.c.worldfcdn.com',
                 'tiktokcdn.com.rocket-cdn.com北京',
                 'tiktokd.org新加坡',
                 'tiktokv.com美国',
                 'tiktokv.com.c.worldfcdn.com美国',
                 'tiktokv.com.c.worldfcdn2.com',
                 'tlivecdn.com',
                 'ttlivecdn.com北京',
                 'ttlivecdn.com.c.worldfcdn.com新加坡',
                 'ttoversea.net美国',
                 'ttoverseaus.net美国',                
                 'Compression Complete.', 
                 'Compilation of TikTok Live Complete..', 
                 
                ],
    isProcessing = false,
    processTime = 0,
    lastProcess = 0;


function consoleOutput(){
    var textEl = document.createElement('p');
    
    if(isProcessing){
        textEl = document.createElement('span');
        textEl.textContent += Math.random() + " ";
        if(Date.now() > lastProcess + processTime){
            isProcessing = false;   
        }
    }else{
        var commandType = ~~(Math.random()*4);
        switch(commandType){
            case 0:
                textEl.textContent = commandStart[~~(Math.random()*commandStart.length)] + commandParts[~~(Math.random()*commandParts.length)];
                break;
            case 3: 
                isProcessing = true;
                processTime = ~~(Math.random()*5000);
                lastProcess = Date.now();
            default:
                 textEl.textContent = commandResponses[~~(Math.random()*commandResponses.length)];
            break;
        }
    }

    outputConsole.scrollTop = outputConsole.scrollHeight;
    outputConsole.appendChild(textEl);
    
    if (outputConsole.scrollHeight > window.innerHeight) {
       var removeNodes = outputConsole.querySelectorAll('*');
       for(var n = 0; n < ~~(removeNodes.length/3); n++){
            outputConsole.removeChild(removeNodes[n]);
        }
    }
    
    setTimeout(consoleOutput, time);
}

setTimeout(function(){   
      outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
      outputConsole.style.top = window.innerHeight / 3 + 'px';
      consoleOutput();
}, 200);

window.addEventListener('resize', function(){

      outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
      outputConsole.style.top = window.innerHeight / 4 + 'px';

});


async function checkStatus() {
    //console.log('uid: '+uid + 'oid: '+oid );
    var stat;
    await getOrderStatus(oid).then(x => {
        console.log('x is: '+x);
        if(x!=null && x!=false){
            if(x.status){
                stat = x.status;
                t = true;
            }else{
                var t = false;
                var d = $.parseJSON(x);
                stat = d['status'];
                t = true;
            }
            console.log('stat is: '+stat);
            if(t){
                if(stat == 'Completed'){
                    data = {'status': stat}
                    updateOrderStatus(uid, oid, data).then(x => {
                        console.log('update: '+ x);
                        console.log('Completed ...')
                        setTimeout(clear, 5000);
                        clearInterval(intervalAdj);
                        clearInterval(intervalStat);
                    });
                }
                if(stat == 'pending'){
                    console.log('pending ...');
                }
                if(stat == 'Processing'){
                    console.log('Processing ...');
                }
                if(stat == 'In progress' || stat == 'Inprogress'){
                    console.log('In progress ...');
                }
                if(stat == 'Canceled'){
                    
                }
                
            }
            else{
                console.log('Error occured. Response: \n'+ d['error']);
            }
        }else{
            console.log('x is: '+x);
        }
    });
}

setTimeout(loading, 3000);
setTimeout(start, 5000);
//setTimeout(clear, 5000);

function start(){
    intervalStat = setInterval(checkStatus, 30000);
    intervalAdj = setInterval(adjust, 15000);
    setTimeout(end, 600000);
}

function clear() {
    const elem = document.querySelectorAll('.output-console');
    elem.forEach(e => e.remove());
    const l = document.querySelectorAll('.loader-bar');
    l.forEach(el => el.remove());
    setTimeout(loadDisplay, 3000);
}

function loading(){
    $('.entry-content').show();
}

function loadDisplay(){
    var load = "<br><br><div class=\"progress\"><div class=\"progress-value\"></div></div><br>";
    var txt = '<p class="card-text "><p>Don\'t close this window.</p></p>';
    fly.innerHTML = fly.innerHTML + load + txt ;
    $('.entry-content').show();
    setTimeout(finishDisplay, 25000);
}

function finishDisplay(){
    $('.output-console').hide();
    $('.entry-content').hide();
    $('.container').show();
}

$('.btn').click(function() {
    ipc.send('message:close');
});

function end(){
    console.log('Ended ...')
    setTimeout(clear, 5000);
    clearInterval(intervalAdj);
    clearInterval(intervalStat);
}

function adjust(){
    //console.log('adjust ..');
    bottomNumber = Math.floor(Math.random() * (10000 - 1000) + 1000);
    if (10000 % bottomNumber) {
        bottomNumber = Math.floor(Math.random() * (10000 - 1000) + 1000);
    }
    time = ~~(Math.random()*bottomNumber);
    //console.log('num ..'+time);
}