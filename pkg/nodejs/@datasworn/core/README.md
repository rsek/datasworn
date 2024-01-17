# Datasworn v0.0.6

Traversal utilities, JSON schema, and Typescript declarations common to Datasworn packages.

This is a pre-release package, provided for developer feedback. It will almost certainly receive breaking changes even on minor versions.



## Usage
### Setup
#### Deserialize the JSON data

Deserialize (parse) the JSON files from one or more data packages  (e.g. `@datasworn/ironsworn-classic`).

##### Example: Using `fs` synchronously
```typescript
import { readFileSync } from 'fs'
import type * as Datasworn from '@datasworn/core'

const rulesPackages: Datasworn.RulesPackage[] = [
  readFileSync('node_modules/@datasworn/starforged/json/starforged.json'),
  readFileSync('node_modules/@datasworn/ironsworn-classic/json/classic.json')
].map(JSON.parse)

```

##### Example: Using `fs/promises` asynchronously
```typescript
import { readFile } from 'fs/promises'
import type * as Datasworn from '@datasworn/core'

const rulesPackages: Datasworn.RulesPackage[] = (await Promise.all([
  readFile('node_modules/@datasworn/starforged/json/starforged.json')
  readFile('node_modules/@datasworn/ironsworn-classic/json/classic.json')
])).map(JSON.parse)

```

##### Using JSON modules

```typescript
import starforged from '@datasworn/starforged/json/starforged.json' assert { type: 'json' }
import classic from '@datasworn/ironsworn-classic/json/classic.json' assert { type: 'json' }

const rulesPackages = [starforged, classic] as Datasworn.RulesPackage[]

```

#### Configure the Datasworn tree

Once you've got all the rules packages you want properly deserialized, you'll need to create the "tree" object that contains every `RulesPackage` object.

```typescript
import { DataswornTree, Id } from '@datasworn/core'

const datasworn = new DataswornTree(...rulesPackages)

// Configure the ID parser to use the new tree by default. This is optional, but without it you'll have to specify the tree object every time
Id.datasworn = datasworn

```

### Lookup by ID
The simplest way is to use the `Id.get` and `Id.getMatches` static methods. They will attempt to infer the type from the ID.

```typescript
const oracleRollable = Id.get('starforged/oracles/core/action')

```

Note that for type safety, `Id.get` will throw an error if you call it on a wildcard ID string. This is because wildcard IDs may return multiple results. Use `Id.getMatches` for wildcard IDs.

```typescript
// `Id.getMatches` returns an array of matched items, instead.
const allOracleRollables = Id.getMatches('*/oracles/**/*') // returns *all* OracleRollable objects!
```

### ID Parser instances

For more advanced manipulations, you can create and interact with parser instances.

```typescript
// create an ID parser instance from a string ID
const oracleRollableId = Id.from('starforged/oracles/core/action') // returns an instance of the RecursiveCollectableId subclass

// wildcard IDs work too -- they use the same subclasses as regular IDs. This wildcard would match *any* OracleRollable object.
const anyOracleRollableId = Id.from('*/oracles/**/*')

// Use the instance's `get` method to look up the appropriate item
const oracleRollable = oracleRollableId.get()

// create an ID parser for the *parent* ID
const oracleRollableParentId = oracleRollableId.getParentCollectionId() // returns an instance of the RecursiveCollectionId subclass


// Create a collectable child ID for the parent -- in other words, the sibling ID of `oracleRollableId`
const oracleRollableId = oracleCollectionId.createChildCollectableId('theme')
console.log(oracleRollableId.toString()) // 'starforged/oracles/core/theme'

```

It's also possible to use the parser subclass constructors directly.

```typescript
import { RecursiveCollectionId } from '@datasworn/core'

// Create an ID parser instance from string parameters
const oracleRollableId = new RecursiveCollectionId('custom', 'oracles', ['core'], 'action')


// Create an ID parser instance with wildcard elements
const anyOracleRollableId = new RecursiveCollectionId('*', 'oracles', ['**'], '*')

```


