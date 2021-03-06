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
  postReq(environment.urlApi, {
    "id": "roulette",
    "authorization": environment.token,
    "params" : {
      rtp: environment.rtp/100,
    },
    "bets": req.body.bets,
  }).then(function(respGame) {  
    res.status(respGame.status).json(respGame.data);
  })
  .catch(function(err) {
    console.log('ERR', err);
    res.status(500).json({error: "An error occured"});
  });
});

app.listen(environment.port, () => {
  console.log("Server started on port " + environment.port + ". Visit http://localhost:" + environment.port);
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