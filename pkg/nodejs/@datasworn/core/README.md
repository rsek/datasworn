# Datasworn v0.0.6

Traversal utilities, JSON schema, and Typescript declarations common to Datasworn packages.

This is a pre-release package, provided for developer feedback. It will almost certainly receive breaking changes even on minor versions.



## Usage
By default, the Datasworn tree (the object you've serialized from a JSON file) must provided as an argument when looking up Datasworn items by ID.

```typescript
const oracleRollable = oracleRollableId.get('starforged/oracles/core/action', dataswornTree)

```

However, you can set `Id.datasworn` (a static property on the `Id` constructor) and it will use this as the default value for that argument.

```typescript
Id.datasworn = dataswornTree
const oracleRollable = oracleRollableId.get('starforged/oracles/core/action')
```

### Get item by ID

```typescript
// create an Id parser instance from an id string
const oracleRollableId = Id.from('starforged/oracles/core/action')
const oracleRollable = oracleRollableId.get()

```

```typescript
// or use the static `get` method to just get the object directly
const oracleRollable = Id.get('starforged/oracles/core/action')

```


### Create a collectable child ID for a given collection ID
```typescript
const oracleCollectionId = Id.from('my_oracles/collections/oracles/core')
const oracleRollableId = oracleCollectionId.createChildCollectableId('theme')
console.log(oracleRollableId.toString()) // 'my_oracles/oracles/core/theme'

```

