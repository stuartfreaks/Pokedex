const pokemonRepository = (function () {
    const pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log('pokemon is not correct');
        }
    }

    function getAll() {
        return pokemonList;
    };

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            const title = document.getElementById('pokemonModalLabel');
            title.innerText = pokemon.name;

            const navigateLeftElement = document.createElement('div');
            navigateLeftElement.classList.add('pokemon-nav');
            if (getPokemonIndex(pokemon) === 0) {
                navigateLeftElement.classList.add('pokemon-nav--disabled');
            }
            navigateLeftElement.innerText = 'Previous';
            navigateLeftElement.addEventListener('click', () => loadPreviousPokemon(pokemon));

            const navigateRightElement = document.createElement('div');
            navigateRightElement.classList.add('pokemon-nav');
            if (getPokemonIndex(pokemon) === pokemonList.length - 1) {
                navigateRightElement.classList.add('pokemon-nav--disabled');
            }
            navigateRightElement.innerText = 'Next';
            navigateRightElement.addEventListener('click', () => loadNextPokemon(pokemon));

            const pokemonInfoElement = document.createElement('div');
            pokemonInfoElement.classList.add('pokemon-info');

            const pokemonContainerElement = document.createElement('div');
            pokemonContainerElement.classList.add('pokemon-container');

            const pictureElement = document.createElement('img');
            pictureElement.src = pokemon.imageUrl;
            pictureElement.style.width = '300px';

            const contentElement = document.createElement('p');
            contentElement.innerText = 'Height: ' + pokemon.height / 10 + 'm';

            const pokemonModalBody = document.getElementById('pokemonModalBody');

            pokemonModalBody.innerHTML = '';

            pokemonInfoElement.appendChild(pictureElement);
            pokemonInfoElement.appendChild(contentElement);
            pokemonContainerElement.appendChild(navigateLeftElement);
            pokemonContainerElement.appendChild(pokemonInfoElement);
            pokemonContainerElement.appendChild(navigateRightElement);
            pokemonModalBody.appendChild(pokemonContainerElement);

        });
    }

    let dialogPromiseReject;

    function hideModal() {
        modalContainer.classList.remove('is-visible');
        if (dialogPromiseReject) {
            dialogPromiseReject();
            dialogPromiseReject = null;
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    function buttonEvent(buttonEl, pokemon) {
        buttonEl.addEventListener('click', function () {
            showDetails(pokemon);
        })
    }

    function addListItem(pokemon) {
        const pokemonList = document.querySelector('.pokemon-list');
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('btn', 'btn-outline-secondary', 'my-button');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemonDetailModal');
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        buttonEvent(button, pokemon);
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (pokemon) {
                add({
                    name: pokemon.name[0].toUpperCase() + pokemon.name.slice(1),
                    detailsUrl: pokemon.url
                });
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(pokemon) {
        return fetch(pokemon.detailsUrl).then(function (response) {
            return response.json();
        }).then(function (details) {
            pokemon.imageUrl = details.sprites.other.dream_world.front_default;
            pokemon.height = details.height;
            pokemon.types = details.types;
        }).catch(function (e) {
            console.error(e);
        });
    }

    function getPokemonIndex(pokemon) {
        return pokemonList.findIndex(p => p.name === pokemon.name);
    }

    function loadPreviousPokemon(pokemon) {
        showDetails(pokemonList[getPokemonIndex(pokemon) - 1]);
    }

    function loadNextPokemon(pokemon) {
        showDetails(pokemonList[getPokemonIndex(pokemon) + 1]);
    }

    return { getAll, addListItem, loadList, loadDetails };
})();

// Rendering DOM
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});