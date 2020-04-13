import { GraphQLServer } from 'graphql-yoga';
import axios from 'axios';
import { promises as fs } from 'fs';

import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema } from 'graphql';
import {fetchPokemon} from "./sources/pokeapi";
import {clean, read, store} from "./sources/file";
import {fetchMoves} from "./sources/pogoapi";


const typeDefs = `

  type Query {
    pokemon(id: Int): Pokemon
    stored: Pokemon
  }
  
  type Mutation {
    store(input: PokemonInput): Pokemon
    clean: Boolean
  }
  
  type Pokemon {
    id: Int
    name: String
    moves(max: Int): PokemonMoves
  }
  
  input PokemonInput {
    id: Int
  }
  
  type PokemonMoves {
    fast: [String]
    charged: [String]
  }
`;

// const pokemonMovesType = new GraphQLObjectType({
//   name: 'PokemonMoves',
//   fields: () => ({
//     charged: {
//       type: new GraphQLList(GraphQLString),
//     },
//     fast: {
//       type: new GraphQLList(GraphQLString),
//     }
//   }),
// });
//
// const queryType = new GraphQLObjectType({
//   name: 'Query',
//   fields: {
//     moves: {
//       type: pokemonMovesType,
//       // `args` describes the arguments that the `user` query accepts
//       args: {
//         id: { type: GraphQLInt }
//       },
//       resolve: async (_, {id}) => {
//         return await fetchMoves(id);
//       }
//     }
//   }
// });

const resolvers = {
  Query: {
    pokemon: async (obj, { id }, context) => {
      const pokemon = await fetchPokemon(id);

      return {
        id: pokemon.data.id,
        name: pokemon.data.name
      }
    },
    stored: async (obj, args, context) => {
      return read();
    }
  },
  Mutation: {
    store: async (obj, { input }, context) => {
      const pokemon = await store(input.id);

      return {
        id: pokemon.data.id,
        name: pokemon.data.name
      }
    },
    clean: async () => {
      await clean();
    }
  },
  Pokemon: {
    moves: async (obj, { max = 999 }, context) => {
      const pokemonMoves = await fetchMoves(obj.id);

      return {
        charged: pokemonMoves.charged_moves.slice(0, max),
        fast: pokemonMoves.fast_moves.slice(0,max)
      }
    }
  }
};


const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // schema: new GraphQLSchema({
  //   query: queryType
  // }),
  context: ({request, response}) => {
    return {
      request,
      response,
      whatever: "I want!"
    }
  },
});

server.start(() => console.log('Server is running on http://localhost:4000'));
