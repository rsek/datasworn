# Datasworn v0.0.4

<p align="center">
<a href="https://www.npmjs.com/package/@datasworn/core"><img alt="undefined" src="https://img.shields.io/npm/v/@datasworn/core?logo=npm" height="20"/></a>
<a href="https://www.npmjs.com/package/@datasworn/core"><img alt="undefined" src="https://img.shields.io/npm/dm/@datasworn/core?logo=npm" height="20"/></a>
<a href="https://discordapp.com/invite/6QMvmJb"><img alt="Join the Ironsworn Discord" src="https://img.shields.io/discord/437120373436186625?color=%235865F2&label=Ironsworn%20Discord&logo=discord&logoColor=white" height="20"/></a>
<a href="https://www.reddit.com/r/Ironsworn/"><img alt="Visit the r/Ironsworn subreddit" src="https://img.shields.io/reddit/subreddit-subscribers/ironsworn?style=social" height="20"/></a>
</p>

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

Package content variously falls under the CC BY 4.0, CC BY-NC 4.0, and MIT licenses. See [LICENSE.md](LICENSE.md) for details.

## Contributors

The previous versions of Datasworn and Dataforged began as unofficial personal projects of [rsek](https://github.com/rsek), who now maintains Datasworn in an official capacity.

Special thanks to [XenotropicDev](https://github.com/XenotropicDev) for allowing me to use data from [TheOracle](https://github.com/XenotropicDev/TheOracle) (a Discord bot for use with Ironsworn and Starforged) as the nucleus of the original.
