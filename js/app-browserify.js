// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var $ = require("jquery")
var _ = require("underscore")
var Backbone = require("backbone")

var Promise = require('es6-promise').Promise
    // just Node?
    // var fetch = require('node-fetch')
    // Browserify?
    // require('whatwg-fetch') //--> not a typo, don't store as a var

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
// start app
// new Router()
// }

var pokeNum = Math.floor((Math.random() * 811) + 1);

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var PokemonDataModel = Backbone.Model.extend({
    url: function() {
        return 'http://pokeapi.co/api/v2/pokemon/' + this.poke_id
    },
    //parse used if you want to format data
    parse: function(data) {
        console.log(data);
        return data;
    }
});

var ChoosenPokemonModel = Backbone.Model.extend({

});

var PokemonTeam = Backbone.Collection.extend({
    model: ChoosenPokemonModel,
    initialize: function() {},

    parse: function(data) {
        console.log(data);
        return data;
    }
});

var team = new PokemonTeam();

var PokemonTeamView = Backbone.View.extend({
    el: '#team',

    render: function() {
        var template = _.template($('#pokemon-team-template').html(), {});
        this.$el.html(template({ pkteam: team.models }));
        return this;
    }
});

var pokemonTeamView = new PokemonTeamView();

var PokemonView = Backbone.View.extend({
    el: '.container',
    events: {
        'click .choose-one': 'chooseOne',
        'click .choose-two': 'chooseTwo',
        'click .choose-three': 'chooseThree'
    },

    initialize: function() {
        this.getRandPokemon();
    },

    //setting pokemon variables
    setPoke1: function(pokemon) {
        //send data to pokemon1
        this.pokemon1 = pokemon;
    },
    setPoke2: function(pokemon) {
        this.pokemon2 = pokemon;
    },
    setPoke3: function(pokemon) {
        this.pokemon3 = pokemon;
    },

    setCounter: function() {
        this.counter++;
    },
    getCounter: function() {
        return this.counter;
    },

    //pokemon variables
    //pokemon1 recieved pokemon data from setPoke1
    pokemon1: '',
    pokemon2: '',
    pokemon3: '',
    counter: 0,

    randomNum: function() {
        var random = Math.floor((Math.random() * 721) + 1);
        return random;
    },

    getRandPokemon: function() {
        var self = this;
        $('.btn').prop('disabled', true);
        $('.pkmn1').html('<img class="loading" src="./img/poke-load.gif" />');
        $('.pkmn2').html('<img class="loading" src="./img/poke-load.gif" />');
        $('.pkmn3').html('<img class="loading" src="./img/poke-load.gif" />');

        var pokeNum1 = this.randomNum();
        var pokeNum2 = this.randomNum();
        var pokeNum3 = this.randomNum();

        if (pokeNum2 === pokeNum1) {
            pokeNum2 = self.randomNum();
        } else if (pokeNum3 === pokeNum1 || pokeNum3 === pokeNum2) {
            pokeNum3 = self.randomNum();
        };

        //if pokeNum1 === this.pokemon1 then generate random again
        var storePokeNum1 = '';
        var storePokeNum2 = '';
        var storePokeNum3 = '';

        if (storePokeNum1 === pokeNum1 || storePokeNum1 === pokeNum2 || storePokeNum1 === pokeNum3) {
            pokeNum1 = self.randomNum;

            if (storePokeNum2 === pokeNum1 || storePokeNum2 === pokeNum2 || storePokeNum2 === pokeNum3) {
                pokeNum2 = self.randomNum;

                if (storePokeNum3 === pokeNum1 || storePokeNum3 === pokeNum2 || storePokeNum3 === pokeNum3) {
                    pokeNum3 = self.randomNum;
                } else {
                    storePokeNum3 = pokeNum3;
                };
            } else {
                storePokeNum2 = pokeNum2;
            };
        } else {
            storePokeNum1 = pokeNum1;
        };

        var poke1 = new PokemonDataModel();
        poke1.poke_id = pokeNum1;

        var poke2 = new PokemonDataModel();
        poke2.poke_id = pokeNum2;

        var poke3 = new PokemonDataModel();
        poke3.poke_id = pokeNum3;

        //when poke fetch is done, run this function with the poke data recieved from the fetch
        $.when(poke1.fetch(), poke2.fetch(), poke3.fetch()).done(function(poke1, poke2, poke3) {
            //put logic here
            $('.loading').prop("style", "display: none");
            poke1[0].name = poke1[0].name.capitalizeFirstLetter();
            poke2[0].name = poke2[0].name.capitalizeFirstLetter();
            poke3[0].name = poke3[0].name.capitalizeFirstLetter();

            $('.pkmn1').html(self.pokemonTemplateOne(poke1[0]));
            $('.pkmn2').html(self.pokemonTemplateTwo(poke2[0]));
            $('.pkmn3').html(self.pokemonTemplateThree(poke3[0]));

            //send pokemon data to setPoke
            self.setPoke1(poke1[0]);
            self.setPoke2(poke2[0]);
            self.setPoke3(poke3[0]);
            $('.btn').prop('disabled', false);
        });
    },

    chooseOne: function() {
        // this.setCounter();

        var poke1 = {
            name: this.pokemon1.name.capitalizeFirstLetter(),
            sprite: this.pokemon1.sprites.front_default
        };

        // console.log(team);
        //re-render that view


        if (team.length < 6) {
            team.push(poke1);
            pokemonTeamView.render();

            if (team.length === 6) {
                alert('Team Complete');
                $('.container').attr("style", "display: none");
                //disable all buttons
                $('.btn').prop('disabled', true);
                return;
            }

            this.getRandPokemon();
        }
    },

    chooseTwo: function() {
        // this.setCounter();

        var poke2 = {
            name: this.pokemon2.name.capitalizeFirstLetter(),
            sprite: this.pokemon2.sprites.front_default
        };

        if (team.length < 6) {
            team.push(poke2);
            pokemonTeamView.render();

            if (team.length === 6) {
                alert('Team Complete');
                $('.container').attr("style", "display: none");
                //disable all buttons
                $('.btn').prop('disabled', true);
                return;
            };

            this.getRandPokemon();
        };
    },

    chooseThree: function() {
        // this.setCounter();

        var poke3 = {
            name: this.pokemon3.name.capitalizeFirstLetter(),
            sprite: this.pokemon3.sprites.front_default
        };

        if (team.length < 6) {
            team.push(poke3);
            pokemonTeamView.render();

            if (team.length === 6) {
                alert('Team Complete');
                $('.container').attr("style", "display: none");
                //disable all buttons
                $('.btn').prop('disabled', true);
                return;
            };

            this.getRandPokemon();
        };
    },

    pokemonTemplateOne: _.template($('#pokemon-one-template').html(), {}),
    pokemonTemplateTwo: _.template($('#pokemon-two-template').html(), {}),
    pokemonTemplateThree: _.template($('#pokemon-three-template').html(), {}),

    render: function() {
        return this;
    }
});

var PokemonRouter = Backbone.Router.extend({
    initialize: function() {
        new PokemonView();

        Backbone.history.start();
    }
});

var pokemonRouter = new PokemonRouter();
