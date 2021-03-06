import { GraphQLServer } from 'graphql-yoga';
import {fetchPokemon, fetchPokemons} from "./sources/pokeapi";
import {clean, load, save} from "./sources/file";
import gql from 'graphql-tag';
import axios from "axios";
import {fetchMoves} from "./sources/pogoapi";

// Type definitions
const typeDefs = gql`
  
  # Query entry type
  type Query {
    getPokemons(limit: Int, offset: Int): [Pokemon]
    getPokemon(name: String): Pokemon
    "See your favourite pokemon."
    load: Pokemon
  }
  
  # Mutation entry type
  type Mutation {
    "Save your favourite pokemon."
    save(input: PokemonInput): Pokemon
    "Delete your favourite pokemon."
    clean: Boolean
  }
  
  # Mutation inputs
  input PokemonInput {
    name: String
  }
    
  # Pokemon object type
  "Pokemon!"
  type Pokemon { 
    id: Int                             # field
    """
    Look at all the moves pokemon has.
    """
    name(encoded: Boolean): String      # field with arguments
    moves: [String]
    # moves(max: Int): PokemonMoves     # different data source
    hasAbilities: [Ability]
    hasTypes: [Type]
  }
  
  type PokemonMoves {
    fast: [String]
    charged: [String]
  }

  type Ability {
    name: String
    belongsTo: [Pokemon]
  }
  
  type Type {
    name: String
    hasPokemons(limit: Int): [Pokemon]
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // Resolution of query fields
    getPokemons: async (root, {limit, offset}, context) => {
      return await fetchPokemons(limit, offset);
    },
    getPokemon: async (root, { name }, context) => {
      return await fetchPokemon(name);
    },
    load: async () => {
      return await load();
    }
  },
  Mutation: {
    save: async (root, { name }) => {
      return await save(name);
    },
    clean: async () => {
      return await clean();
    }
  },
  Pokemon: {
    // Resolution of pokemon fields
    id: (pokemon) => { return pokemon.id },
    name: (pokemon, {encoded}) => {
      return encoded ? Buffer.from(pokemon.name).toString('base64') : pokemon.name;
    },
    moves: async (pokemon) => {
      return pokemon.moves.map((move) => {
        return move.move.name;
      })
    },
    // moves: async (pokemon, { max = 999 }, context) => {
    //   const pokemonMoves = await fetchMoves(pokemon.id);
    //
    //   return {
    //     charged: pokemonMoves.charged_moves.slice(0, max),
    //     fast: pokemonMoves.fast_moves.slice(0,max)
    //   }
    // },
    hasAbilities: async (pokemon, {}) => {
      const abilities = pokemon.abilities;

      return abilities.map(async (ability) => {
        return await axios.get(ability.ability.url);
      })
    },
    hasTypes: async (pokemon, {}) => {
      const types = pokemon.types;

      return types.map(async (type) => {
        return await axios.get(type.type.url);
      })
    }
  },
  Ability: {
    name: (ability) => {
      return ability.data.name;
    },
    belongsTo: async (ability, {}, context) => {
      const pokemons = [];

      for (let key in ability.data.pokemon) {
        let pokemon = await axios.get(ability.data.pokemon[key].pokemon.url);
        pokemons.push(pokemon.data);
      }

      return pokemons;
    }
  },
  Type: {
    name: (type) => {
      return type.data.name;
    },
    hasPokemons: async (type, {limit = 999}, context) =>{
      const pokemons = [];
      let counter = 0;

      for (let key in type.data.pokemon) {
        let pokemon = await axios.get(type.data.pokemon[key].pokemon.url);
        pokemons.push(pokemon.data);
        counter++;
        if (counter > limit) break;
      }

      return pokemons;
    }
  }
};

// Configure server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({request, response}) => {
    return {
      request,
      response,
      whatever: "I want!",
      // data sources
      // controllers
      // anything!
    }
  },
});

// Start server
server.start(() => console.log('Server is running on http://localhost:4000'));
