const express = require('express')
const app = express()
var port=process.env.PORT||8080;
const path = require('path')
var https = require('https');
var bodyParser = require('body-parser')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var cardRouter = require('./routes/homepage');
var flash = require('flash-express');
app.use(bodyParser());


function getCard(){
    res= https.get('https://api.scryfall.com/cards/random', res =>{
        var body='';
        res.on('data', data =>{
            body+=data;
        })
        res.on('end', ()=>
        {
            json=JSON.parse(body);
            console.log(json.name);
            return(json.name);
        })
    });    
  
}
app.use(flash());
app.use('/', cardRouter);
/*
app.get('/', (req, res) =>{ 
    var body='';
    aaa = https.get('https://api.scryfall.com/cards/random', result =>{
        result.on('data', data =>{
            body+=data;
        })
        result.on('end', ()=>
        {
            var json=JSON.parse(body);
            console.log(json.name);
            res.render('main',{img : json.image_uris.normal});
            
        })
    });
    console.log("hey"+  aaa.result);  

})
*/

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))