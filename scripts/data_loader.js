const Hero = require('../app/models/hero');
const http = require('http');
const config = require('../config/main');
var crypto = require('crypto');
const API_BASE = config.MARVEL_API_BASE_URL;
const API_PUBLIC_KEY = config.MARVEL_API_PUBLIC_KEY;
const API_PRIVATE_KEY = config.MARVEL_API_PRIVATE_KEY;
const API_TS = config.MARVEL_API_TS;


module.exports = function() {  
    fetchHeros(0, 100, 0);
}


function fetchHeros(offset, limit, total) {
    http.get(API_BASE + '/characters?limit=' + limit + '&offset=' + offset + '&ts=' + API_TS + '&apikey=' + API_PUBLIC_KEY + '&hash=' + getHash(), function(res) {
        if(offset === 0) {
            console.log("fetching data from marvel website");
        }

        res.setEncoding('utf8');
        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            let responseBody = JSON.parse(data);

            if(res.statusCode == 409 || res.statusCode == 401) {
                console.log(responseBody.message);
                return;
            }

            if(total == 0 || offset < total) {
                let heros = responseBody.data.results;
                let total = responseBody.data.total;

                heros.forEach(function(hero, index) {
                    Hero.findOne({id: hero.id}, function(err, foundHero) {
                        if(!foundHero) {
                            newHero = new Hero(hero);
                            newHero.save();
                        } else {
                            foundHero.name = hero.name;
                            foundHero.description = hero.description;
                            foundHero.modified = hero.modified;
                            foundHero.thumbnail = hero.thumbnail;
                            foundHero.save();
                        }
                    });
                });   
            
            console.log('retrieved ' + (parseInt(offset) + parseInt(heros.length)) + '/' + total + ' heros from marvel api');
            
            if(offset >= total) {
                console.log('all heros were updated successfully');
            }
            
            fetchHeros(offset + limit, limit, total);
            }
        });
    });
}


function getHash() {
    return crypto.createHash('md5').update(API_TS + API_PRIVATE_KEY + API_PUBLIC_KEY).digest("hex");
}