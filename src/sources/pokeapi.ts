import axios from "axios";

export async function fetchPokemon(name: string = 'pikachu') {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toString().toLowerCase()}`);

    return result.data;
}

export async function fetchPokemons(limit: number = 5, offset: number = 0) {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

    const pokemons = result.data.results.map((pokemon) => {
        return fetchPokemon(pokemon.name);
    })

    return pokemons;
}