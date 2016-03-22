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

var PokemonDataModel = Backbone.Model.extend({
	url: function(){
		return 'http://pokeapi.co/api/v2/pokemon/' + this.poke_id
	},

	parse: function(data){
		console.log(data);
		return data;
	}
});

var Pokedex = Backbone.Collection.extend({
	model: PokemonDataModel,
	url: 'http://pokeapi.co/api/v2/pokemon/',
	initialize: function() {
		this.fetch();
	},

	parse: function(data){
		console.log(data);
		return data;
	}
});

// var pokedex = new Pokedex();

// var pokemon = new Pokemon();

var PokemonView = Backbone.View.extend({
	el: '.container',
	events: {
		'click #pkmn-btn': 'getRandPokemon'
	},

	initialize: function(){
		this.getRandPokemon();
		this.render();
	},

	getRandPokemon: function(){
		var self = this;
		var pokeNum1 = Math.floor((Math.random() * 721) + 1);
		var pokeNum2 = Math.floor((Math.random() * 721) + 1);
		
		var pokemon1 = new PokemonDataModel();
		pokemon1.poke_id = pokeNum1;

		var pokemon2 = new PokemonDataModel();
		pokemon2.poke_id = pokeNum2;

		$.when(pokemon1.fetch(), pokemon2.fetch()).done(function(pokemon1, pokemon2){
			//put logic here
			$('.pkmn1').html(self.pokemonTemplateOne(pokemon1[0]));
			$('.pkmn2').html(self.pokemonTemplateTwo(pokemon2[0]));
			
		})
	},

	pokemonTemplateOne: _.template($('#pokemon-one-template').html(), {}),
	pokemonTemplateTwo: _.template($('#pokemon-two-template').html(), {}),

	render: function() {
		return this;
	}
});

var PokemonRouter = Backbone.Router.extend({
	initialize: function(){
		Backbone.history.start();
		new PokemonView();
	}
});

var pokemonRouter = new PokemonRouter();

