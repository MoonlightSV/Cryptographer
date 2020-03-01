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
 
Subject.prototype.notify = function(){
  let observerCount = this.observers.count();
  for(let i=0; i < observerCount; i++){
    this.observers.get(i).update();
  }
};

function Observer(){
	this.update = () => {};
}

function extend( obj, extension ){
  for ( let key in extension ){
    obj[key] = extension[key];
  }
}

let encrypt_btn = document.querySelector(".encryption__button");
let encryption = "";
let language = document.querySelector("#alphabet");

extend( encrypt_btn, new Subject() );

let atbash = document.querySelector(".atbash__check");
let caesar = document.querySelector(".caesar__check");
let vigener = document.querySelector(".vigener__check");

extend( atbash, new Observer() );
extend( caesar, new Observer() );
extend( vigener, new Observer() );

function subscribe(){
	if (this.checked){
		encrypt_btn.addObserver( this );
	}else{
		encrypt_btn.removeObserver( this );
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
}

function changeMode( radio ){
	if ( radio.value == "observer" ){
		unChecked();

		encrypt_btn.onclick = () => {
			encrypt_btn.notify();
		};

		atbash.onchange = subscribe;
		caesar.onchange = subscribe;
		vigener.onchange = subscribe;
	}else{
		unChecked();
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

atbash.update = () => {
	if (input_txt.textLength)
		encrypt_txt.value += "Атбаш: " + input_txt.value.trim() + " => " + atbash.ciferFunc( input_txt, encryption.value, language.value ) + "\n";
};

caesar.update = () => {
	if (input_txt.textLength)
		encrypt_txt.value += "Цезарь: " + input_txt.value.trim() + " => " + caesar.ciferFunc( input_txt, encryption.value, language.value ) + "\n";
};

vigener.update = () => {
	if (input_txt.textLength)
		encrypt_txt.value += "Виженер: " + input_txt.value.trim() + " => " + vigener.ciferFunc( input_txt, encryption.value, language.value ) + "\n";
};

function ciferAtbash( txt, action, lang ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let tebahpla_ur = "ЯЮЭЬЫЪЩШЧЦХФУТСРПОНМЛКЙИЗЖЁЕДГВБА";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let tebahpla_ur1 = "яюэьыъщшчцхфутсрпонмлкйизжёедгвба";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let tebahpla_gne = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";
	let tebahpla_gne1 = "zyxwvutsrqponmlkjihgfedcba";
	let string = "";

	for ( let char of txt.value.trim() ){
		if ( lang == "ru" ) {
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
		}else if ( lang == "eng" ){
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

function ciferCaesar( txt, action, lang ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";

	let offset = document.querySelector(".caesar__offset");
	let string = "";

	for ( let char of txt.value.trim() ){
		if ( lang == "ru" ) {
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_ru, char, offset, action );
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_ru1, char, offset, action );
			}
		}else if ( lang == "eng" ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_eng.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_eng, char, offset, action );
			}else{
				if ( alphabet_eng1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += ciferCaesarString( alphabet_eng1, char, offset, action );
			}
		}
	}

	return string;
}

function ciferCaesarString( alphabet, char, offset, action ){
	let string = "";

	if ( action == "encrypt" ){
		string += alphabet[
		(alphabet.indexOf(char) + +offset.value) >= alphabet.length ? 
		alphabet.indexOf(char) + +offset.value - alphabet.length : 
		alphabet.indexOf(char) + +offset.value];
	}else if ( action == "decrypt" ){
		string += alphabet[
		(alphabet.indexOf(char) - +offset.value) < 0 ? 
		alphabet.indexOf(char) - +offset.value + alphabet.length : 
		alphabet.indexOf(char) - +offset.value];
	}

	return string;
}

function ciferVigener( txt, action, lang ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let alphabet_eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let alphabet_eng1 = "abcdefghijklmnopqrstuvwxyz";
	let txt_wsp = txt.value.split(" ").join("");
	let keyword = document.querySelector(".vigener__keyword");
	let key_txt = keyword.value.toUpperCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let key_txt1 = keyword.value.toLowerCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let string = "";
	let i = 0;
	let index;

	if ( action === "encrypt" ){
		for ( let char of txt.value.trim() ){
			if ( lang == "ru" ){
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
			}else if ( lang == "eng" ){
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
	}else if ( action === "decrypt" ){
		for ( let char of txt.value.trim() ){
			if ( lang == "ru" ){
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
			}else if ( lang == "eng" ){
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
	}

	return string;
}