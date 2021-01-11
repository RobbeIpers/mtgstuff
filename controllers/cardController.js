
var express = require('express');
var router = express.Router();
var https = require('https');
var nextCard;
var score=0;
var bigsmal;
var prijs =0;
var validator = require("express-validator");
const { validationResult, body } = require('express-validator');
var bodyParser = require('body-parser');
const { json } = require('body-parser');
var highscore=0;
//app.use(random_card);
random_card =(req, res, next )=>{
    res= https.get('https://api.scryfall.com/cards/random', res =>{
        var body='';
        res.on('data', data =>{
            body+=data;
        })
        res.on('end', ()=>
        {
            json=JSON.parse(body);
            console.log(json.name)
        })
    });    
  
};

 
function getCard(res){

    https.get("https://api.scryfall.com/cards/random?q=usd>%3D10+not%3Apromo", function(response) {
        var responses="";

        response.on('data', function(chunk){
            responses+=(chunk);
            
        });
        response.on('end', function(){
            newCard = JSON.parse(responses);
            var newPrijs = newCard.prices.usd;
            if(newCard.prices.usd==null){
                if(newCard.prices.usd_foil==null){
                    if(newCard.prices.eur==null){
                        console.log(newCard)
                        getCard(res);
                        return;
                    }
                    newPrijs=newCard.prices.eur*1,18;
                }
                newPrijs=newCard.prices.usd_foil;
            }
            
            if(prijs <= newPrijs){
                bigsmal=1;
            }
            else{
                bigsmal=0;
            }
            console.log("old: "+ prijs+", "+ "new: "+newPrijs+ "bigsmal: "+ bigsmal);
   
            var temp=nextCard;
            nextCard=newCard;
            
            if(score>highscore){highscore=score;}

            res.render('main',{img : temp.image_uris.normal,img2 :nextCard.image_uris.normal, prijs1:prijs, score:score, highscore:highscore});
            prijs=newPrijs;

        });
    }); 
};
    


exports.post =[     
    (req,res,next)=>{
        var title="fout";
        const errors = validationResult(req);
        console.log(req.body.high+" == "+ bigsmal);
        if(!errors.isEmpty){
            req.flash(errors);
            res.redirect("/");
        }
        else{
        if(req.body.high==bigsmal){
            title="juist";
            score++;    
            res.flash('Je had het juist je score is: '+score);

        }
        else{     
            res.flash('Je had het fout', 'error');
            score=0;
        }
        getCard(res);}
} 
];
exports.index = function(req, response) {
    
    var bodies=[]
    var completed_requests = 0;

    for (i = 0; i < 2; i++) {
       
        https.get("https://api.scryfall.com/cards/random?q=usd>%3D10+not%3Apromo", function(res) {
            
            var responses="";

            res.on('data', function(chunk){
                responses+=(chunk);
              });
      
           res.on('end', function(){
             
            bodies.push(responses)
               //console.log("ended"+completed_requests);
                if (completed_requests++ ==  1) {
                    json1=JSON.parse(bodies[0]);
                    json2=JSON.parse(bodies[1]);
                    if(json1.prices.usd<=json2.prices.usd){
                        bigsmal=1;
                    }
                    else{
                        bigsmal=0;
                    }
                    nextCard=json2;
                    prijs =json1.prices.usd;
                    if(prijs==null){prijs=json1.prices.eur*1,18}
                    response.render('main',{img : json1.image_uris.normal,img2 :json2.image_uris.normal, prijs1:prijs, score:0});
                }
            });
        });    
    }

     
    // All download done, process responses array
   
    //res.render('main', {title:random_card()});
};
