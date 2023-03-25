const { update } = require('firebase/database');
const ipc = require('electron').ipcRenderer;

var balance = document.getElementById('balance');

var userid;

ipc.on('userlogin', function(event, uid) {
  console.log("login data is:::::: " + uid);
  userid = uid;
  queryDailyBalance(uid).then(x => {
    balance.innerHTML = "+"+x;
  });
});

const start = document.getElementById('start');
start.addEventListener('click', async function(event){
  var sid, quantity;
  var link = document.getElementById('url').value;

  if(link.includes('https://') == false){
    link = 'https://' + link;
  }

  await getConfig().then(x => {
    s = JSON.parse("[" + x.child('sids').val().toString().replace(/^,+|,+$/g, '') + "]");
    sid = s[Math.random() * s.length | 0];
    min = x.child('order').child('orderMin').val();
    max = x.child('order').child('orderMax').val()
    quantity = randomNo(parseInt(min), parseInt(max));
    console.log("service id: " + sid);
    console.log("service: " + s);
  }).then(async function(){        
      await checkLimit(userid).then(async x => {
      console.log("Returned1: " + x);
      if(x=='zero'){
        //daily limit reached
        alert('You\'ve reached daily limit. Try tomorrow.')
      } else{
        //make order
        await makeOrder(link, quantity, sid).then(async z => {
          console.log("Returned2: " + z.order);
          if (z.order != false && z.order != null){   
            await addOrder(z.order, userid, quantity, sid, link, getDate(), getTime(), 'processing').then(async x => {
              await updateCount(userid).then(async y => {
                await updateUserBalance(userid);
                console.log("Limit count updated: " + y);
              });
            });
            ipc.send('loadProgress', [userid, z.order]);
          } else{
            alert("Ops, something went wrong. Please try again.")
          }
        });
      }
    });
  });
});

function logout(){
  ipc.send('changeWindow', '/user/login');
}
