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

function Subject(){
  this.observers = new ObserverList();
}
 
Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};
 
Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};
 
Subject.prototype.notify = function( context ){
  let observerCount = this.observers.count();
  for(let i=0; i < observerCount; i++){
    this.observers.get(i).update( context );
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
let decrypt_btn = document.querySelector(".decryption__button");

extend( encrypt_btn, new Subject() );
extend( decrypt_btn, new Subject() );

let atbash = document.querySelector(".atbash__check");
let caesar = document.querySelector(".caesar__check");
let vigener = document.querySelector(".vigener__check");

extend( atbash, new Observer() );
extend( caesar, new Observer() );
extend( vigener, new Observer() );

function subscribe(){
	if (this.checked){
		encrypt_btn.addObserver( this );
		decrypt_btn.addObserver( this );
	}else{
		encrypt_btn.removeObserver( this );
		decrypt_btn.removeObserver( this );
	}
}

function unChecked(){
	atbash.checked = false;
	caesar.checked = false;
	vigener.checked = false;
}

function changeMode( radio ){
	if ( radio.value == "observer"){
		unChecked();

		encrypt_btn.onclick = () => {
			encrypt_btn.notify("encrypt");
		};

		decrypt_btn.onclick = () => {
			decrypt_btn.notify("decrypt");
		};

		atbash.onchange = subscribe;
		caesar.onchange = subscribe;
		vigener.onchange = subscribe;
	}else{
		unChecked();
	}
}

let queueArr = [];

function addToQueue( cifer ){
	if (cifer.checked){
		queueArr.push cifer.cifer;
	}else{
		queueArr.
	}
}


let input_txt = document.querySelector(".input__text");
let encrypt_txt = document.querySelector(".encryption__text");
let decrypt_txt = document.querySelector(".decryption__text");

atbash.update = ( action ) => {
	if ( action === "encrypt" ){
		encrypt_txt.value += "Атбаш: " + input_txt.value.trim() + " => " + ciferAtbash( input_txt, action ) + "\n";
	}else if ( action === "decrypt" ){
		decrypt_txt.value += "Атбаш: " + input_txt.value.trim() + " => " + ciferAtbash( input_txt, action ) + "\n";
	}
};

caesar.update = ( action ) => {
	if ( action === "encrypt" ){
		encrypt_txt.value += "Цезарь: " + input_txt.value.trim() + " => " + ciferCaesar( input_txt, action ) + "\n";
	}else if ( action === "decrypt" ){
		decrypt_txt.value += "Цезарь: " + input_txt.value.trim() + " => " + ciferCaesar( input_txt, action ) + "\n";
	}
};

vigener.update = ( action ) => {
	if ( action === "encrypt" ){
		encrypt_txt.value += "Виженер: " + input_txt.value.trim() + " => " + ciferVigener( input_txt, action ) + "\n";
	}else if ( action === "decrypt" ){
		decrypt_txt.value += "Виженер: " + input_txt.value.trim() + " => " + ciferVigener( input_txt, action ) + "\n";
	}
};

function ciferAtbash( txt, action ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let tebahpla_ur = "ЯЮЭЬЫЪЩШЧЦХФУТСРПОНМЛКЙИЗЖЁЕДГВБА";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let tebahpla_ur1 = "яюэьыъщшчцхфутсрпонмлкйизжёедгвба";
	let string = "";

	if ( action === "encrypt" ){
		for ( let char of txt.value.trim() ){
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
		}
	}else if ( action === "decrypt" ){
		for ( let char of txt.value.trim() ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru[tebahpla_ur.indexOf(char)];
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru1[tebahpla_ur1.indexOf(char)];
			}
		}
	}

	return string;
}

function ciferCaesar( txt, action ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let offset = document.querySelector(".caesar__offset");
	let string = "";

	if ( action === "encrypt" ){
		for ( let char of txt.value.trim() ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru[
				(alphabet_ru.indexOf(char) + +offset.value) >= alphabet_ru.length ? 
				alphabet_ru.indexOf(char) + +offset.value - alphabet_ru.length : 
				alphabet_ru.indexOf(char) + +offset.value];
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru1[
				(alphabet_ru1.indexOf(char) + +offset.value) >= alphabet_ru1.length ? 
				alphabet_ru1.indexOf(char) + +offset.value - alphabet_ru1.length : 
				alphabet_ru1.indexOf(char) + +offset.value];
			}
		}
	}else if ( action === "decrypt" ){
		for ( let char of txt.value.trim() ){
			if ( char == char.toUpperCase() ){
				if ( alphabet_ru.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru[
				(alphabet_ru.indexOf(char) - +offset.value) < 0 ? 
				alphabet_ru.indexOf(char) - +offset.value + alphabet_ru.length : 
				alphabet_ru.indexOf(char) - +offset.value];
			}else{
				if ( alphabet_ru1.indexOf(char) == -1){
					string += char;
					continue;
				}
				string += alphabet_ru1[
				(alphabet_ru1.indexOf(char) - +offset.value) < 0 ? 
				alphabet_ru1.indexOf(char) - +offset.value + alphabet_ru1.length : 
				alphabet_ru1.indexOf(char) - +offset.value];
			}
		}
	}

	return string;
}

function ciferVigener( txt, action ){
	let alphabet_ru = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let alphabet_ru1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
	let txt_wsp = txt.value.split(" ").join("");
	let keyword = document.querySelector(".vigener__keyword");
	let key_txt = keyword.value.toUpperCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let key_txt1 = keyword.value.toLowerCase().repeat(txt_wsp.length).substr(0, txt_wsp.length);
	let string = "";
	let i = 0;
	let index;

	if ( action === "encrypt" ){
		for ( let char of txt.value.trim() ){
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
		}
	}else if ( action === "decrypt" ){
		for ( let char of txt.value.trim() ){
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
		}
	}

	return string;
}