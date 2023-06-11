const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
var pseudo;

const maxRecords = 151;
const limit = 12;
let offset = 0;

async function convertPokemonToLi(pokemon) {
	const util = {
		pseudo: pseudo,
		pokemon: pokemon.number,
	};

	const utilJSON = JSON.stringify(util);

	try {
		const response = await fetch("/couple", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: utilJSON,
		});

		if (response.ok) {
			console.log("Pokemon", pokemon.number, " lié au user");
			const test = `
		  <li class="pokemon ${pokemon.type}">
			<span class="number">#${pokemon.number}</span>
			<span class="name">${pokemon.name}</span>
  
			<div class="detail">
			  <ol class="types">
				${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
			  </ol>
  
			  <img src="${pokemon.photo}" onclick="releaseIt(${pokemon.number})" alt="${pokemon.name}" ">
			</div>
  
			<p>Abilities</p>
  
			<div class="detail">
			  <ol class="abilities">
				${pokemon.abilities.map((ability) => `<li class="ability">${ability}</li>`).join("")}
			  </ol>
			</div>
		  </li>
		`;
			return test;
		} else {
			console.log("La relation n'existe pas");
			const test = `
		  <li class="pokemon missing">
			<span class="number">#${pokemon.number}</span>
			<span class="name">???</span>
  
			<div class="detail">
			  <img src="./pokedex/assets/img/mysteryPokemon.jpg" onclick="catchIt(${pokemon.number})" alt="missing">
			</div>
  
			<p>Abilities</p>
  
			<div class="detail">
			  <ol class="abilities">
				<li class="ability">???</li>
			  </ol>
			</div>
		  </li>
		`;
			return test;
		}
	} catch (error) {
		console.log(error);
		return ""; // En cas d'erreur, renvoie une chaîne vide
	}
}

function catchIt(numberPokemon) {
	fetch("/pseudo", {
		method: "GET",
	})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Request failed.");
		})
		.then(function (data) {
			const utilisateurActuel = data.pseudo;
			console.log("Utilisateur actuel :", utilisateurActuel);
			const util = {
				pseudo: utilisateurActuel,
				number: numberPokemon,
			};
			const utilJSON = JSON.stringify(util);
			return fetch("/newPokemon", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: utilJSON,
			});
		})
		.then(function (response) {
			if (response.ok) {
				console.log("Pokemon lié à l'utilisateur");
			} else {
				throw new Error("Request failed.");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}

function releaseIt(numberPokemon) {
	const util = {
		pseudo: pseudo,
		number: numberPokemon,
	};
	const utilJSON = JSON.stringify(util);
	return fetch(`/couple`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: utilJSON,
	})
		.then(function (response) {
			if (response.ok) {
				console.log("Pokemon relaché par l'utilisateur");
			} else {
				throw new Error("Request failed.");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}

function deconnexion() {
	fetch("/deconnexion", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((response) => {
		if (response.redirected) {
			window.location.href = response.url; // Redirection vers "/"
		}
	});
}

window.onload = () => {
	let btnCon = document.getElementById("deco");
	btnCon.addEventListener("click", deconnexion);

	//Va chercher le pseudo de l'utilisateur et le rentre dans la variable "pseudo"
	fetch("/pseudo", {
		method: "GET",
	})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Request failed.");
		})
		.then(function (data) {
			const pseudoValue = data.pseudo;
			pseudo = pseudoValue.toString(); // Convertir en chaîne de caractères
		})
		.catch(function (error) {
			console.log(error);
		});
};

function loadPokemonItens(offset, limit) {
	pokeApi.getPokemons(offset, limit).then(async (pokemons = []) => {
		const newHtml = (await Promise.all(pokemons.map(convertPokemonToLi))).join("");

		pokemonList.innerHTML += newHtml;
	});
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
	offset += limit;
	const qtdRecordsWithNexPage = offset + limit;

	if (qtdRecordsWithNexPage >= maxRecords) {
		const newLimit = maxRecords - offset;
		loadPokemonItens(offset, newLimit);

		loadMoreButton.parentElement.removeChild(loadMoreButton);
	} else {
		loadPokemonItens(offset, limit);
	}
});
