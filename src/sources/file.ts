import {promises as fs} from "fs";
import {fetchPokemon} from "./pokeapi";


const STORED_FILE = 'stored.json';

export async function store(id: number) {
    const pokemon = await fetchPokemon(id);
    await fs.writeFile(STORED_FILE, JSON.stringify(pokemon.data));

    return pokemon;
}

export async function read() {
    const storedPokemon = await fs.readFile(STORED_FILE);
    return JSON.parse(storedPokemon.toString());
}

export async function clean() {
    await fs.unlink(STORED_FILE);
}