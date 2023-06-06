const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 12
let offset = 0;

function convertPokemonToLi(pokemon) {
    
    return `
        <li class="pokemon missing">
            <span class="number">#${pokemon.number}</span>
            <span class="name">???</span>

            <div class="detail">
                <img src="./assets/img/mysteryPokemon.jpg"
                     alt="missing">
            </div>

                        
            <p>Abilities</p>
            
            <div class="detail">
                
                <ol class="abilities">
                    <li class="ability">???</li>
                </ol>
            </div>

        </li>
        `
/*`
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>

                        
            <p>Abilities</p>
            
            <div class="detail">
                
                <ol class="abilities">
                    ${pokemon.abilities.map((ability) => `<li class="ability">${ability}</li>`).join('')}
                </ol>
            </div>

        </li>
    `*/
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        /*fetch("/tasks")
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Erreur lors de la récupération des tâches");
			}
		})
		.then((data) => {
			// Traitez les données reçues et créez les éléments DOM correspondants

		})
		.catch((error) => {
			console.error(error);
		})*/
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
