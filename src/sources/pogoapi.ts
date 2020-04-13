import axios from "axios";

export async function fetchMoves(id: number) {
    const data = await axios.get('https://pogoapi.net/api/v1/current_pokemon_moves.json');

    const filtered = data.data.filter((item) => {
        return item.pokemon_id === id;
    })

    return filtered.length > 0 ? filtered[0] : [];
};