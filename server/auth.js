import fetch from 'node-fetch';
import { userInfo } from 'os';

var Auth = {
    token: null,
    exp: null,
    userInfo: null,
    getSession: async function(){
        console.log('Getting session')
        var response = await fetch("https://wms.tesla.com/system/v1/api/authentication/login", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "authorization": "Bearer null",
              "content-type": "application/json",
              "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
            },
            "referrer": "https://wms.tesla.com/auth/login",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"name\":\"milwatson\",\"password\":\"Zp3KutcpqeJ5\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
          });
          
          try {
              var data = await response.text();
              data = JSON.parse(data);
              console.log(data.token)
              token = data.token();
          } catch (error) {

          }
    },
    
    tokenExpired: function(){
        if(this.token === null){
            return true;
        }else{
            var current = new Date().getTime();
            if(current > this.exp){
                return true;
            }else{
                return false
            }
        }
    }
}


var a = Auth;
a.checkStatus();
setTimeout(function(){
    console.log('a.token = ', a.token)
    console.log(a.userInfo)
},1500)