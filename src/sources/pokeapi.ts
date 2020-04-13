import axios from "axios";

export async function fetchPokemon(id: number) {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toString().toLowerCase()}`);
}