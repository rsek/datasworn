import FastGlob from 'fast-glob'
import fs from 'fs-extra'
import { PKG_DIR_NODE, VERSION } from '../../const.js'
import { writeJSON } from '../../utils/readWrite.js'
import { isEqual, mapValues } from 'lodash-es'
import path from 'path'
import Log from '../../utils/Log.js'

export async function updatePackageVersions(
  dir = PKG_DIR_NODE,
  newVersion = VERSION
) {
  const pkgs = await FastGlob(dir + '/**/package.json')
  const readmes = [...(await FastGlob(dir + '/**/README.md')), './README.md']

  const toWrite = [] as Promise<void>[]

  const pattern =
    /^(?<headerText># .+? v)(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/

  for (const filePath of [...pkgs, path.join(process.cwd(), 'package.json')])
    toWrite.push(
      fs.readJSON(filePath).then(async (json) => {
        const oldVersion = json?.version as string



        if (oldVersion !== newVersion) {
          Log.info(
            `Updating from v${oldVersion} to v${newVersion} in ./${path.relative(
              process.cwd(),
              filePath
            )}`
          )
          json.version = newVersion
        }

        const newDependencies = mapValues(json.dependencies as Record<string, string>, (value, key) => key.startsWith('@datasworn/') ? newVersion : value)

        if (!isEqual(json.dependencies, newDependencies))
          json.dependencies = newDependencies

        return writeJSON(filePath, json)
      })
    )

  for (const filePath of readmes) {
    toWrite.push(
      fs.readFile(filePath, { encoding: 'utf-8' }).then(async (markdown) => {
        const newMarkdown = markdown.replace(pattern, `$1${newVersion}`)

        if (isEqual(markdown, newMarkdown)) return

        Log.info(
          `Bumping to v${newVersion} in ./${path.relative(
            process.cwd(),
            filePath
          )}`
        )
        return fs.writeFile(filePath, newMarkdown)
      })
    )
  }

  await Promise.all(toWrite)
}
