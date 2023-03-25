const ipc = require('electron').ipcRenderer;
var uid;

$(() => {
    $("form").on("submit", e => {
        uid = document.getElementById('uid').value;
        execute(uid);
        e.preventDefault();
    });
  });

const login = document.getElementById('login');
login.addEventListener('click', async function(event){
    uid = document.getElementById('uid').value;
    execute(uid);
});

var dataLog;

async function execute(uid){
    await queryUser(uid).then(async x => {
        console.log(' res x: '+JSON.stringify(x));
        if(x == false){
            dataLog = {'userid': uid, 'response': 'user doesn\'t exist', 'time': getDate() + ', ' + getTime()}
            continueLogin(false, x);
        } else {
            dataLog = {'response': JSON.stringify(x), 'time': getDate() + ', ' + getTime()}
            continueLogin(true, x);
        }
    });
}

async function continueLogin(state, x){
    await addLog(uid, dataLog, state).then(async y => {
        console.log('res y: '+y + ' res x: '+y);
        if(x!=false){
            console.log(x.child("uid").val());
            data = {'last_logged_in': getDate() + ' ' + getTime()}
            console.log('time: '+ getTime());
            
            await updateUser(uid, data).then(x => {
                console.log('x is: ' + x);
            });
            ipc.send('userlogin', uid);
            } else{
            alert('Something went wrong. Try again.');
            }
    });
}

