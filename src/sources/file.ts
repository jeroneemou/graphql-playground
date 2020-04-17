import {promises as fs} from "fs";
import {fetchPokemon} from "./pokeapi";

const STORED_FILE = 'stored.json';

export async function save(name: string) {
    const pokemon = await fetchPokemon(name);
    await fs.writeFile(STORED_FILE, JSON.stringify(pokemon));

    return pokemon;
}

export async function load() {
    const storedPokemon = await fs.readFile(STORED_FILE);
    return JSON.parse(storedPokemon.toString());
}

export async function clean() {
    try {
        await fs.unlink(STORED_FILE);
    } catch (err) {
        return false;
    }

    return true;
}