var express = require('express');
var path = require('path');
var os = require('os');

var basicHeaders = {
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

const app = express();
const port = 110;
var bodyParser = require('body-parser') ;
// var compression = require('compression');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('../client/build'));

app.get('/health', function(req, res){
  res.send('{"status": "healthy"}')
})

app.get('/api/*', async function(req, res){
    var path = `https://wms.tesla.com${req.path.slice(4)}`;
    console.log('GETTING ', )
    // fetch("https://wms.tesla.com/system/v1/api/authentication/userinfo", {
    //     "headers": {
    //         "accept": "application/json, text/plain, */*",
    //         "accept-language": "en-US,en;q=0.9",
    //         "authorization": "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW5pZCI6MSwiZG9tYWlubmFtZSI6IkRlZmF1bHQiLCJleHAiOjE2NTU5OTg3ODQsImZpcnN0bmFtZSI6Ik1pbGVzIiwiaG9tZXBhZ2V1cmwiOiIiLCJpYXQiOjE2NTU5NDgzODQsImlzcyI6InByZCIsImxhbmciOiJlbiIsImxhc3RuYW1lIjoiV2F0c29uIiwibG9jYWxlIjoiZW4tVVMiLCJwcmltYXJ5d2FyZWhvdXNlY2xhc3MiOiJTQyIsInByaW1hcnl3YXJlaG91c2VkZXNjIjoiVGVzbGEgU2VydmljZSBDb3J0ZSBNYWRlcmEiLCJwcmltYXJ5d2FyZWhvdXNlaWQiOjE0NDIsInJvbGVzIjpbIkRDIFdhcmVob3VzZSBMZWFkIiwiUmVhZCBPbmx5IiwiU2VydmljZSBMZWFkIl0sInN1YiI6Im1pbHdhdHNvbiIsInRpbWV6b25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsInVzZXJpZCI6Mzk5OCwidXQiOjIsIndhcmVob3VzZW5hbWUiOiI1ODk4In0.h0lqXw2g46w-dAWJiulS6FTai6uczuboCX4sVc9zWyf24wJcXFPntB6bDgX0CwH8UnS8Ca-zU_oWhb0XRiyVqZBw0P9RQJY8-zyncEyozn0vvQz0cuGv5eV_h8RQyFwWkTJ9YKC5IXfMg0s3TqVZSZb8mQHtS4vBuj8P6x8pQ7ITqYv2d6NRQ-_lZoAaAOIzb6TjG_wQ9Y0zRIsyEcwU--UKj6HDlcOnvPKgyZ3GZV4YMf0sGsOQYKE9oLzE9gJTSaKjFJJDshMXZEc2tF1B9ZcdtAb7E1-eqMY0pStCRYFvHuLLAmYUrazgZqGVCt4pfj6yVgGvgyHRzJox7-ql0mGG9uMUoUo2R7o8Oo6xrQ-72oBqlJLXzojLkgu9Sd1loJUGo9-L3Xwv8IScMHgF4HyhVyP_dd6WTD_HhH9jMfAO3I7Fb64nm2XfC6E_RFAuvWpACdbnOqO13H0ByiYsitUttAqbyezYg2rYnRqL24-08JDWdZ74GA3f29aHW6BRaD-g52whID6-RiRk9mvxW44CqEx7MnysH-CSa00ukZpjFIojZoQ69QFTuQq2wRk5s_iFS-fkOGM1UCx6b2lAV5WViDHPEaokxm_poOQbhwgdyhaj-XQ7wjt5sh_6hbos-nK-SqDAUG6U2skH2Cq9vT8hfr3sOCIyywdgWVLVANM",
    //         "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"macOS\"",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-origin",
    //         "cookie": "_ga=GA1.2.2060949509.1652641848; _ga_KFP8T9JWYJ=GS1.1.1655259264.7.1.1655259305.0; _abck=BDFA8FEA888D2BFA08E9DDAA3AF4E162~0~YAAQJDPFF/tvP2mBAQAA/O4AiQgSzCtsPz4KjV24eR7At2GtEfnAv3uyWGqHlhSQ4ONRIGJYoJw0ejD7IqCL7fAbnUHlG/yZWSFRlPDEE/7vMddBGv1RFC18BQO+QUMAzkv0ZDQbAjNsQ30ElKVoabifNsMRcXGgJcag7VohjehGMMjcWEtjK0cZx91ufqWUtJT263kP81EW8wwaSFKxnKEnXrx2zJoLXeV/uxPt7L+L1dcHY5enxUvMhoVYDtRJMgfOj8X2EtPmyV9djaaw3zuq2Kv9DPGTrcxsSCiYtJUl+azBd5sfsf6VPohdps+blKGkLwoFoAlFRUDCEVce777Dn1YkqKYmiCgsbU71jqxfKiABRtzaeMjTZzzCbfZuiFgcWkZR1BnIK3zs19GerzFZ91WtlOM=~-1~-1~-1; RT=\"z=1&dm=tesla.com&si=efc3f37b-77ef-40c6-9cab-30ddf2b8ffe9&ss=l4owuvlk&sl=0&tt=0\"",
    //         "Referer": "https://wms.tesla.com/auth/login",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     "body": null,
    //     "method": "GET"
    // });
    try{

    var response = await fetch(path, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": req.headers.authorization,
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": "_ga=GA1.2.2060949509.1652641848; _ga_KFP8T9JWYJ=GS1.1.1655259264.7.1.1655259305.0; _abck=BDFA8FEA888D2BFA08E9DDAA3AF4E162~0~YAAQJDPFF/tvP2mBAQAA/O4AiQgSzCtsPz4KjV24eR7At2GtEfnAv3uyWGqHlhSQ4ONRIGJYoJw0ejD7IqCL7fAbnUHlG/yZWSFRlPDEE/7vMddBGv1RFC18BQO+QUMAzkv0ZDQbAjNsQ30ElKVoabifNsMRcXGgJcag7VohjehGMMjcWEtjK0cZx91ufqWUtJT263kP81EW8wwaSFKxnKEnXrx2zJoLXeV/uxPt7L+L1dcHY5enxUvMhoVYDtRJMgfOj8X2EtPmyV9djaaw3zuq2Kv9DPGTrcxsSCiYtJUl+azBd5sfsf6VPohdps+blKGkLwoFoAlFRUDCEVce777Dn1YkqKYmiCgsbU71jqxfKiABRtzaeMjTZzzCbfZuiFgcWkZR1BnIK3zs19GerzFZ91WtlOM=~-1~-1~-1; RT=\"z=1&dm=tesla.com&si=efc3f37b-77ef-40c6-9cab-30ddf2b8ffe9&ss=l4owuvlk&sl=0&tt=0\"",
            "Referer": "https://wms.tesla.com/auth/login",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "method": "GET"
    });
        var data = await response.text();
        res.send(data);
    }catch(error){
        res.send(error)
    }

    // response.then(data => {data.text()})
    // .then(function(data){
    //      try{
    //         console.log('success sending data: ', data)
    //         res.send(data);
    //      }
    //      catch(error){
    //         res.send(JSON.stringify(error));
    //      }
    //  },
    //  function(error){
    //     console.log('promise rejected: ', error)
    //  }

    //  );

});

app.put('/api/*', async function(req, res){
  var path = `https://wms.tesla.com${req.path.slice(4)}`;
  console.log('PUTTING ', path)
  var body = req.body
  console.log('PUT body = ',  body)
  try{
  var response = await fetch(path, {
      "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "authorization": req.headers.authorization,
          "content-type": "application/json",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(body),
      "method": "PUT",
      "mode": "cors",
      "credentials": "include"
    });
      var data = await response.text();
      res.send(data)
    }catch(error){
      res.send(data)
    }
})

app.post('/api/*', async function(req, res){
    var path = `https://wms.tesla.com${req.path.slice(4)}`;
    console.log('POSTING ', path)
    var body = req.body;

    try{
      var response = await fetch(path, {
          "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "authorization": req.headers.authorization,
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
          "body": JSON.stringify(body),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        var data = await response.text();
        res.send(data)
      }catch(error){
        res.send(data)
      }

})

// app.get('/status', async function(req, res){
//     var isConnected = await Auth.checkStatus()
//     console.log('isConnected = ', isConnected)
//     console.log(JSON.stringify(Auth))
//     res.send({connected: isConnected})
// })

// app.post('/login-form', async function(req, res){
//     console.log('/login-form Creating Session');
//     res.send(JSON.stringify(
//         {
//             "success": isConnected
//         }
//     ));
// })

app.post('/log/', async function(req, res){
  // curl -X PATCH -d '{"1088129-00-z": 69}' 'https://tesla-7b642-default-rtdb.firebaseio.com/partaudit.json'
  console.log(JSON.stringify(req.body.data))
  try{
    var response = await fetch('https://tesla-7b642-default-rtdb.firebaseio.com/partaudit.json', {
        "method": "PATCH",
        body: JSON.stringify({a:2})
    });
        var data = await response.text();
        res.send(data);
    }catch(error){
        res.send(error)
    }
    
})

// app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(os.homedir()+'/Documents/quickbin/client/build'))

app.listen(port, () => {
  console.log(`SWIFT BIN Update app listening at http://localhost:${port}`)
  console.log(os.homedir()+'/Documents/quickbin/client/build')

})
