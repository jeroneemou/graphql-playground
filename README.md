# Graphql playground

## Documentation

### Commands
* `yarn dev` or `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground

### Sources

PokeApi - https://pokeapi.co/
PoGoApi - https://pogoapi.net/

### Queries

Example of queries executable on example of this playground

```
## Simple query
query SomePokemons {  # operation type and name
  getPokemons {       # query name
    name              # fields and selection
  }
}


## Complex query
query SpecificPokemons($limit: Int) {     # variable definitions
  getPokemons(limit: $limit, offset: 5) { # arguments
    id
    name                                  # nested arguments
  } 
}
# Parameters { "limit": 5 }


## Fragments
fragment PokemonDetails on Pokemon {
  name
  moves
}

query FragmentedPokemons {  # operation type and name
  getPokemons {             # query name
    ...PokemonDetails
  }
}
# and inline fragments ...
```

## Mutation

```
## Mutation - almost the same as query
mutation SavePokemon($name: String = "pikachu") {
  save(input: { name: $name} ) {   # Input type
    name
    moves
  }
}

query LoadPokemon {
  load {
    name
    moves
  }
}

mutation ClearSavedPokemon {
  clean
}

# with Exception!
# If the operation is a mutation, the result of the operation
# is the result of executing the mutation’s top level selection
# set on the mutation root object type. This selection set should
# be executed serially.
# It is expected that the top level fields in a mutation 
# operation perform side‐effects on the underlying data system. 
# Serial execution of the provided mutations ensures against 
# race conditions during these side‐effects.
```

Nested and introspection
```
query FetchPokemon($name: String = "ditto", $maxMoves: Int = 999) {
  getPokemon(name: $name) {
    id
    name
  	moves(max: $maxMoves) {
      fast
      charged
  	}
    hasAbilities { # this is a simple field
      name
      belongsTo {
        id
        name
        hasAbilities {
          name
        }
      }
    }
  }
}

query Introspection {
  __schema {
    types {
      name
      description
      fields {
        name
      }
    }
  }
}
```