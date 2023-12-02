# Datasworn v0.0.4

[![@datasworn/core on npm](https://img.shields.io/npm/v/@datasworn/core?logo=npm)](https://www.npmjs.com/package/@datasworn/core)
[![@datasworn/core on npm](https://img.shields.io/npm/dm/@datasworn/core?logo=npm)](https://www.npmjs.com/package/@datasworn/core)
[![Official *Ironsworn* Discord server](https://img.shields.io/discord/437120373436186625?color=%235865F2&label=Ironsworn%20Discord&logo=discord&logoColor=white)](https://discordapp.com/invite/6QMvmJb)
[![Visit the r/Ironsworn subreddit](https://img.shields.io/reddit/subreddit-subscribers/ironsworn?style=social)](https://www.reddit.com/r/Ironsworn/)

## Usage

### Javascript and Typescript
Datasworn spans several NodeJS packages [available via npm](https://www.npmjs.com/org/datasworn).

* `@datasworn/core`: Contains the Typescript typings and the JSON schema, on which all other Datasworn packages depend.
* `@datasworn/ironsworn-classic`: Contains JSON data from the original <cite>Ironsworn</cite> rulebook.
* `@datasworn/ironsworn-classic-delve`: Contains JSON data from <cite>Ironsworn: Delve</cite>, an expansion to the <cite>Ironsworn</cite> rulebook.
* `@datasworn/starforged`: Contains JSON data from <cite>Ironsworn: Starforged</i>.


### Other languages
Typings for C# (System.Text), Go, Java (Jackson), Python, Ruby, and Rust are available in the [json-typedef](json-typedef) directory.

These are automatically generated from a [JSON TypeDef](https://jsontypedef.com) schema. For the data itself, see below.

### JSON
The JSON schema and JSON data are available in the [datasworn](datasworn) directory.

## Licensing

Core package content (the typings and JSON schema) and internal tooling uses the MIT license.

Textual and image content (in other words, the actual content from the rulebooks as described in JSON, Markdown, and other files) is CC-BY-4.0 or CC-BY-NC-4.0.

Additionally, the JSON files embed licensing information in the `source` property that appears on many objects throughout Datasworn.

## Contributors

The previous versions of Datasworn and Dataforged began as unofficial personal projects of [rsek](https://github.com/rsek), who now maintains Datasworn in an official capacity.

Special thanks to [XenotropicDev](https://github.com/XenotropicDev) for allowing me to use data from [TheOracle](https://github.com/XenotropicDev/TheOracle) (a Discord bot for use with Ironsworn and Starforged) as the nucleus of the original.
