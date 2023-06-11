const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 12;
let offset = 0;

async function convertPokemonToLi(pokemon) {
	var user = "'Dim'";
	const util = {
		pseudo: "Dim",
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
  
			  <img src="${pokemon.photo}" alt="${pokemon.name}">
			</div>
  
			<p>Abilities</p>
  
			<div class="detail">
			  <ol class="abilities">
				${pokemon.abilities.map((ability) => `<li class="ability">${ability}</li>`).join("")}
			  </ol>
			</div>
		  </li>
		`;

			//console.log(test);
			return test;
		} else {
			console.log("La relation n'existe pas");
			const test = `
		  <li class="pokemon missing">
			<span class="number">#${pokemon.number}</span>
			<span class="name">???</span>
  
			<div class="detail">
			  <img src="./pokedex/assets/img/mysteryPokemon.jpg" onclick="catchIt(${pokemon.number},${user})" alt="missing">
			</div>
  
			<p>Abilities</p>
  
			<div class="detail">
			  <ol class="abilities">
				<li class="ability">???</li>
			  </ol>
			</div>
		  </li>
		`;

			//console.log(test);
			return test;
		}
	} catch (error) {
		console.log(error);
		return ""; // En cas d'erreur, renvoie une chaîne vide
	}
}

function catchIt(numberPokemon, user) {
	const util = {
		pseudo: user,
		number: numberPokemon,
	};

	console.log(util);
	const utilJSON = JSON.stringify(util);

	fetch("/newPokemon", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: utilJSON,
	})
		.then(function (response) {
			if (response.ok) {
				console.log("Pokemon lié au user");
				return;
			}
			throw new Error("Request failed.");
		})
		.catch(function (error) {
			console.log(error);
		});
}

function loadPokemonItens(offset, limit) {
	pokeApi.getPokemons(offset, limit).then(async (pokemons = []) => {
		const newHtml = (await Promise.all(pokemons.map(convertPokemonToLi))).join("");
		console.log("newpokemon html " + newHtml);
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
