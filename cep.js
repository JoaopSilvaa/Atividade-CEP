console.log("=== CEP ===");

// Actions

function onlyNumbers(e) {
    // console.log(arguments[0]);
    // console.log(e.target.value);
    // console.log(this.value, this.value.match(/\d+/));
    // console.log(this.value, /\d+/.test(this.value));
    this.value = this.value.replace(/\D+/g, "");
}

const button = document.querySelector(".btn").addEventListener("click", validateEntry);

function validateEntry(event) {
    event.preventDefault();
    const cep = document.querySelector("#cep");    
    if (cep.value.length === 8) {
        // this.style.borderColor = ""; 
        // this.style.borderWidth = "";
        // this.style.backgroundColor = "";
        cep.classList.remove("error");
        getAddress(cep.value);
        renderCards();
    } else {        
        // this.style.borderColor = "red";
        // this.style.borderWidth = "2px";
        // this.style.backgroundColor = "yellow";
        cep.classList.add("error");
    }
}

function getAddress(postalCode) {
    // endpoint
    // const endpoint = "https://viacep.com.br/ws/" + postalCode + "/json/";
    const endpoint = `https://viacep.com.br/ws/${postalCode}/json/`;
    
    // config
    const config = {
        method: "GET"
    };

    // request
    /*
    
                  Promise
                    |
                 <pending>
                /         \
           fulfilled     rejected
           .then()       .catch()
    */
    fetch(endpoint, config)
        .then(function(resp) { return resp.json(); })
        .then(getAddressSuccess)
        .catch(getAddressError);
}

function getAddressSuccess(address) {
   if (address.cep === undefined) {
    throw new Error('Undefined');
   }
   
    const ceps = localStorage.getItem('ceps');

    if (!ceps) {
        localStorage.setItem('ceps', JSON.stringify([address]));
    } else {
        const listCeps = JSON.parse(localStorage.getItem('ceps'));
            listCeps.push(address);
            localStorage.setItem('ceps', JSON.stringify(listCeps));
    }   
}
 
function renderCards() {
    const ceps = JSON.parse(localStorage.getItem('ceps'));
    
    ceps.map((address) => {
        const div = document.createElement("div");
        div.classList.add('card');
        div.style = "width: 18rem"
        const divSecond = document.createElement('div');
        divSecond.classList.add('card-body');
        const h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.append(`${address.logradouro}`);
        const h6 = document.createElement('h6');
        h6.classList.add('card-subtitle');
        h6.classList.add('mb-2');
        h6.classList.add('text-body-secondary');
        h6.append(` ${address.bairro} - ${address.localidade} - ${address.uf}`);            
        const p = document.createElement('p');
        p.classList.add('card-text');
        p.append(`${address.cep}`);
        divSecond.append(h5);
        divSecond.append(h6);
        divSecond.append(p);
        div.append(divSecond);
    
        return document.querySelector(".cards").append(div);
    });
}


function getAddressError() {
    console.log("deu ruim 1!");
}

window.onload = renderCards();


// Mapping Events
document.querySelector("#cep").addEventListener("input", onlyNumbers); // onlyNumbers(InputEvent)