# Graphql playground

## Documentation

### Commands
* `yarn dev` or `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground

### Queries

```
mutation StorePokemon {
  store(input: {id: 1}) {
    id
    name
  }
}

mutation CleanStoredPokemon {
  clean
}

query StoredPokemon {
  stored {
    id
    name
    moves {
      fast
    }
  }
}

query FetchPokemon($id: Int = 1, $maxMoves: Int = 999) {
  pokemon(id: $id) {
    id
    name
  	moves(max: $maxMoves) {
      fast
      charged
    }
  }
}
```

with params:
```
{
  "id": 33,
  "maxMoves": 1
}
```