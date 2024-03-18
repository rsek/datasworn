# Datasworn v0.0.7

[![@datasworn/core on npm](https://img.shields.io/npm/v/@datasworn/core?logo=npm)](https://www.npmjs.com/package/@datasworn/core)
[![@datasworn/core on npm](https://img.shields.io/npm/dm/@datasworn/core?logo=npm)](https://www.npmjs.com/package/@datasworn/core)
[![Official *Ironsworn* Discord server](https://img.shields.io/discord/437120373436186625?color=%235865F2&label=Ironsworn%20Discord&logo=discord&logoColor=white)](https://discordapp.com/invite/6QMvmJb)
[![Visit the r/Ironsworn subreddit](https://img.shields.io/reddit/subreddit-subscribers/ironsworn?style=social)](https://www.reddit.com/r/Ironsworn/)

## What is this?

This is a pre-release of the successor to the original Datasworn repository and Dataforged package, which provided game rules from the *Ironsworn* and *Ironsworn: Starforged* in JSON.

Until it reaches v1.0, it may receive breaking changes on any version change.

If you're looking for the original Datasworn JSON files, they are available on the [`legacy` branch](https://github.com/rsek/datasworn/tree/legacy).

## Why a new version?
Some of the design goals for the new standard:

* provide a format that accomodates both classic *Ironsworn* and *Ironsworn: Starforged*
* language-agnostic JSON schema as the "source of truth", rather than a JSON schema generated from Typescript typings
* provide type information for languages other than Typescript
* provide an interchange format that better accomodates homebrew/3rd party content, so it can be imported to any project that relies on the format
* provide a format friendlier to localization
* a format and codebase that are less messy, more consistent, and easier to maintain

## Usage

### Javascript and Typescript
Datasworn spans several NodeJS packages [available via npm](https://www.npmjs.com/org/datasworn).

* [`@datasworn/core`](https://www.npmjs.com/package/@datasworn/core): Contains the Typescript typings and the JSON schema, on which all other Datasworn packages depend.
* [`@datasworn/ironsworn-classic`](https://www.npmjs.com/package/@datasworn/ironsworn-classic): Contains JSON data from the original *Ironsworn* rulebook.
* [`@datasworn/ironsworn-classic-delve`](https://www.npmjs.com/package/@datasworn/ironsworn-classic-delve): Contains JSON data from *Ironsworn: Delve*, an expansion to the *Ironsworn* rulebook.
* [`@datasworn/starforged`](https://www.npmjs.com/package/@datasworn/starforged): Contains JSON data from *Ironsworn: Starforged*, and a number of SVG icons and WEBP planet images.


### Other languages
Typings for C# (System.Text), Go, Java (Jackson), Python, Ruby, and Rust are available in the [json-typedef](json-typedef) directory.

These are automatically generated from a [JSON TypeDef](https://jsontypedef.com) schema. For the data itself, see below.

### JSON
The JSON schema and JSON data are available in the [datasworn](datasworn) directory.

## Licensing

Core package content (the typings and JSON schema) and internal tooling use the MIT license.

Textual and image content (in other words, the actual content from the rulebooks as described in JSON, Markdown, and other files) is CC-BY-4.0 or CC-BY-NC-4.0.

Additionally, the JSON files embed licensing information in the `source` property that appears on many objects throughout Datasworn.

## Contributors

The previous versions of Datasworn and Dataforged began as unofficial personal projects of [rsek](https://github.com/rsek), who now maintains Datasworn in an official capacity.

Special thanks to [XenotropicDev](https://github.com/XenotropicDev) for allowing me to use data from [TheOracle](https://github.com/XenotropicDev/TheOracle) (a Discord bot for use with Ironsworn and Starforged) as the nucleus of the original.
