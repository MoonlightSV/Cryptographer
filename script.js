'use strict'

function ObserverList(){
	this.observerList = [];
}

ObserverList.prototype.add = function( obj ){
	return this.observerList.push( obj );
};

ObserverList.prototype.count = function(){
	return this.observerList.length;
};

ObserverList.prototype.get = function( index ){
	if( index > -1 && index < this.observerList.length ){
		return this.observerList[ index ];
	}
};

ObserverList.prototype.indexOf = function( obj, startIndex ){
	var i = startIndex;

	while( i < this.observerList.length ){
		if( this.observerList[i] === obj ){
			return i;
		}
		i++;
	}

	return -1;
};

ObserverList.prototype.removeAt = function( index ){
	this.observerList.splice( index, 1 );
};

ObserverList.prototype.removeAll = function(){
	this.observerList.length = 0;
};

function Subject(){
	this.observers = new ObserverList();
}

Subject.prototype.addObserver = function( observer ){
	this.observers.add( observer );
};

Subject.prototype.removeObserver = function( observer ){
	this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};

Subject.prototype.notify = function( context, output ){
	let observerCount = this.observers.count();
	for(let i=0; i < observerCount; i++){
		this.observers.get(i).update( this.observers.get(i), context, output );
	}
};

function Observer(){
	this.update = ( obj, context, output ) => {
		output.value += obj.name + ": " + context.txt.trim() + " => " + obj.ciferFunc( context ) + "\n";
	};
}

function extend( obj, extension ){
	for ( let key in extension ){
		obj[key] = extension[key];
	}
}

function Conveyer(){
	this.conveyerList = [];
}

Conveyer.prototype.add = function( obj ){
	return this.conveyerList.push( obj );
};

Conveyer.prototype.count = function(){
	return this.conveyerList.length;
};

Conveyer.prototype.get = function( index ){
	if( index > -1 && index < this.conveyerList.length ){
		return this.conveyerList[ index ];
	}
};

Conveyer.prototype.indexOf = function( obj, startIndex ){
	var i = startIndex;

	while( i < this.conveyerList.length ){
		if( this.conveyerList[i] === obj ){
			return i;
		}
		i++;
	}

	return -1;
};

Conveyer.prototype.removeAt = function( index ){
	this.conveyerList.splice( index, 1 );
};

Conveyer.prototype.removeAll = function(){
	while (this.conveyerList.length){
		this.conveyerList[this.conveyerList.length - 1].index = -1;
		this.conveyerList[this.conveyerList.length - 1].labels[0].textContent = this.conveyerList[this.conveyerList.length - 1].text;
		this.conveyerList.pop();
	}
};

let conveyer = new Conveyer();

let context = {};

let encrypt_btn = document.querySelector(".encryption__button");
let encryption = "";
let language = document.querySelector("#alphabet");
let caesarOffset = document.querySelector(".caesar__offset");

extend( encrypt_btn, new Subject() );

language.onchange = () => {
	switch(language.value){
		case "ru": 
			caesarOffset.max = 33;
			caesarOffset.value = 1;
			break;
		case "eng": 
			caesarOffset.max = 26;
			caesarOffset.value = 1;
			break;
		default: break;
	}
};

let atbash = document.querySelector(".atbash__check");
let caesar = document.querySelector(".caesar__check");
let vigener = document.querySelector(".vigener__check");

extend( atbash, new Observer() );
extend( caesar, new Observer() );
extend( vigener, new Observer() );

atbash.name = "Атбаш";
caesar.name = "Цезарь";
vigener.name = "Виженер";

atbash.index = -1;
caesar.index = -1;
vigener.index = -1;

atbash.text = atbash.labels[0].textContent;
caesar.text = caesar.labels[0].textContent;
vigener.text = vigener.labels[0].textContent;

function subscribe(){
	if (this.checked){
		encrypt_btn.addObserver(this);
	}else{
		encrypt_btn.removeObserver(this);
	}
}

function addConveyerItem(){
	if (this.checked){
		conveyer.add(this);
		this.index = conveyer.indexOf(this, 0);
	}else{
		conveyer.removeAt(this.index);
		this.index = -1;
		this.labels[0].textContent = this.text;
		for (let i = 0; i < conveyer.conveyerList.length; i++){
			conveyer.conveyerList[i].index = conveyer.indexOf(conveyer.conveyerList[i], 0);
		}
	}
	for (let i = 0; i < conveyer.conveyerList.length; i++){
		conveyer.conveyerList[i].labels[0].textContent = conveyer.conveyerList[i].text + " [" + (+conveyer.conveyerList[i].index + 1) + "]";
	}
}

function unChecked(){
	atbash.disabled = false;
	caesar.disabled = false;
	vigener.disabled = false;
	atbash.checked = false;
	caesar.checked = false;
	vigener.checked = false;
	encrypt_btn.observers.removeAll();
	conveyer.removeAll();
}

function changeMode( radio ){
	if ( radio.value == "observer" ){
		unChecked();

		encrypt_btn.onclick = () => {
			if (input_txt.value.length){
				context.txt = input_txt.value;
				context.action = encryption;
				context.lang = language.value;
				encrypt_btn.notify( context, encrypt_txt );
			}
		};

		atbash.onchange = subscribe;
		caesar.onchange = subscribe;
		vigener.onchange = subscribe;
	}else{
		unChecked();

		encrypt_btn.onclick = () => {
			if (input_txt.value.length){
				context.txt = input_txt.value;
				context.action = encryption;
				context.lang = language.value;

				let str = "";

				for (let i = 0; i < conveyer.conveyerList.length; i++){	
					context.txt = conveyer.conveyerList[i].ciferFunc( context );
					str += i == 0 ? conveyer.conveyerList[i].name : ", " + conveyer.conveyerList[i].name;
				}

				encrypt_txt.value += str + ": " + input_txt.value + " => " + context.txt + "\n";
			}
		};

		atbash.onchange = addConveyerItem;
		caesar.onchange = addConveyerItem;
		vigener.onchange = addConveyerItem;
	}
}

function changeEncryption( radio ){
	encryption = radio.value;
	encrypt_btn.disabled = false;
}

let input_txt = document.querySelector(".input__text");
let encrypt_txt = document.querySelector(".encryption__text");

atbash.ciferFunc = ciferAtbash;
caesar.ciferFunc = ciferCaesar;
vigener.ciferFunc = ciferVigener;

function ciferAtbash( context ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let tebahpla_ur = "ЯЮЭЬЫЪЩШЧЦХФУТСРПОНМЛКЙИЗЖЁЕДГВБА";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let tebahpla_ur1 = "яюэьыъщшчцхфутсрпонмлкйизжёедгвба";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let tebahpla_gne = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";
	let tebahpla_gne1 = "zyxwvutsrqponmlkjihgfedcba";
	let string = "";

	for ( let char of context.txt.trim() ){
		if ( context.lang == "ru" ) {
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += tebahpla_ur[alphabet_ru.indexOf(char)];
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += tebahpla_ur1[alphabet_ru1.indexOf(char)];
			}
		}else if ( context.lang == "eng" ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_eng.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += tebahpla_gne[alphabet_eng.indexOf(char)];
			}else{
				if ( alphabet_eng1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += tebahpla_gne1[alphabet_eng1.indexOf(char)];
			}
		}
	}

	return string;
}

function ciferCaesar( context ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";

	let string = "";

	for ( let char of context.txt.trim() ){
		if ( context.lang == "ru" ) {
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_ru, char, caesarOffset, context.action );
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_ru1, char, caesarOffset, context.action );
			}
		}else if ( context.lang == "eng" ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_eng.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_eng, char, caesarOffset, context.action );
			}else{
				if ( alphabet_eng1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_eng1, char, caesarOffset, context.action );
			}
		}
	}

	return string;
}

function ciferCaesarString( alphabet, char, caesarOffset, action ){
	let string = "";

	if ( action == "encrypt" ){
		string += alphabet[
		(alphabet.indexOf(char) + +caesarOffset.value) >= alphabet.length ? 
		alphabet.indexOf(char) + +caesarOffset.value - alphabet.length : 
		alphabet.indexOf(char) + +caesarOffset.value];
	}else if ( action == "decrypt" ){
		string += alphabet[
		(alphabet.indexOf(char) - +caesarOffset.value) < 0 ? 
		alphabet.indexOf(char) - +caesarOffset.value + alphabet.length : 
		alphabet.indexOf(char) - +caesarOffset.value];
	}

	return string;
}

function ciferVigener( context ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";
	let txt_wsp = context.txt.split(" ").join("");
	let keyword = document.querySelector(".vigener__keyword");
	let keyword_wsp = keyword.value.split(" ").join("");
	let key_txt = keyword_wsp.toUpperCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let key_txt1 = keyword_wsp.toLowerCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let string = "";
	let i = 0;
	let index;

	if ( context.action === "encrypt" ){
		for ( let char of context.txt.trim() ){
			if ( context.lang == "ru" ){
				if ( char == char.toUpperCase() ){
					if ( alphabet_ru.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_ru.indexOf(char) + alphabet_ru.indexOf(key_txt[i])) % 33;
					string += alphabet_ru[index];
					i++;
				}else{
					if ( alphabet_ru1.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_ru1.indexOf(char) + alphabet_ru1.indexOf(key_txt1[i])) % 33;
					string += alphabet_ru1[index];
					i++;
				}
			}else if ( context.lang == "eng" ){
				if ( char == char.toUpperCase() ){
					if ( alphabet_eng.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_eng.indexOf(char) + alphabet_eng.indexOf(key_txt[i])) % 26;
					string += alphabet_eng[index];
					i++;
				}else{
					if ( alphabet_eng1.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_eng1.indexOf(char) + alphabet_eng1.indexOf(key_txt1[i])) % 26;
					string += alphabet_eng1[index];
					i++;
				}
			}
		}
	}else if ( context.action === "decrypt" ){
		for ( let char of context.txt.trim() ){
			if ( context.lang == "ru" ){
				if ( char == char.toUpperCase() ){
					if ( alphabet_ru.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_ru.indexOf(char) - alphabet_ru.indexOf(key_txt[i]) + 33) % 33;
					string += alphabet_ru[index];
					i++;
				}else{
					if ( alphabet_ru1.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_ru1.indexOf(char) - alphabet_ru1.indexOf(key_txt1[i]) + 33) % 33;
					string += alphabet_ru1[index];
					i++;
				}
			}else if ( context.lang == "eng" ){
				if ( char == char.toUpperCase() ){
					if ( alphabet_eng.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_eng.indexOf(char) - alphabet_eng.indexOf(key_txt[i]) + 26) % 26;
					string += alphabet_eng[index];
					i++;
				}else{
					if ( alphabet_eng1.indexOf(char) == -1){
						string += char;
						continue;
					}
					index = (alphabet_eng1.indexOf(char) - alphabet_eng1.indexOf(key_txt1[i]) + 26) % 26;
					string += alphabet_eng1[index];
					i++;
				}
			}
		}
	}

	return string;
}