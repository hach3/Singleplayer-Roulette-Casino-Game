const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var { environment } = require('./environment');


app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/src'));

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/src/roulette.html'));
});


/* PLAY A GAME */
app.post('/play', (req,res) => {
  var bets = [{"amount":25,"type":"color","value":"red"}];
  postReq(environment.urlApi, {
    "id": "roulette",
    "authorization": environment.token,
    "params" : {},
    "bets": bets,
    // "bets": [
    //   {
    //     "amount": parseFloat(req.body.bet),
    //     "type": "default",
    //     "value": parseFloat(req.body.number)
    //   }
    // ]
  }).then(function(respGame) {  
    res.status(respGame.status).json(respGame.data);
  })
  .catch(function(err) {
    console.log('ERR', err);
    res.status(500).json({error: "An error occured"});
  });
});

app.listen(8081, () => {
  console.log("Server ready")
});

/* Post request handler */
async function postReq(url, body) {
  return await axios
  .post(url, body)
  .then(resp => {
    if(resp.status !== 200) {
      throw new Error(`Erreur HTTP ! statut : ${resp.status}`);
    }
    return resp;
  })
  .catch(error => {
    // console.log('ERR', error)
    throw new Error(`Erreur HTTP ! statut : ${error}`);
  });
}