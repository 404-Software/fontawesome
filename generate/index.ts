const path = require('path') as typeof import('path')
const fs = require('fs') as typeof import('fs')
import { transform } from '@svgr/core'

const iconFileDirectory = (pack: 'solid' | 'brands' | 'regular') =>
  path.resolve(__dirname, `./fontawesome/${pack}`)

const iconFileNames = {
  solid: fs.readdirSync(iconFileDirectory('solid')),
  brands: fs.readdirSync(iconFileDirectory('brands')),
  regular: fs.readdirSync(iconFileDirectory('regular')),
}

const getIconSvg = async (
  filename: string,
  pack: 'solid' | 'brands' | 'regular'
) => {
  return new Promise<string>((resolve) =>
    fs.readFile(
      path.resolve(iconFileDirectory(pack), filename),
      'utf8',
      (_, svg) => resolve(svg)
    )
  )
}

const srcDirectory = path.resolve(__dirname, '../src/')

const run = async (pack: 'solid' | 'brands' | 'regular') => {
  await Promise.all(
    iconFileNames[pack].map(async (filename) => {
      const svg = await getIconSvg(filename, pack)

      const componentName = getComponentName(filename)

      const transformed = await transform(
        svg,
        {
          native: true,
          ref: false,
          expandProps: 'end',
          typescript: true,
          svgProps: {
            fill: 'currentColor',
          },
        },
        {
          componentName: `${componentName}${capitalizeFirstLetter(pack)}`,
        }
      )

      const outDirectory = srcDirectory
      const outPath = path.resolve(
        outDirectory,
        filename.replace('.svg', `-${pack}.tsx`)
      )

      await new Promise((resolve) => {
        fs.writeFile(outPath, heading + '\n' + transformed, resolve)
      })
    })
  )

  const generateIndexFile = () => {
    const packs = ['solid', 'brands', 'regular']
    const contents: string[] = []
    const types: string[] = []

    packs.forEach((pack, packIndex) =>
      iconFileNames[pack].forEach((filename, index) => {
        contents.push(
          `export { default as ${getComponentName(
            filename
          )}${capitalizeFirstLetter(pack)} } from './src/${
            filename.split('.')[0]
          }-${pack}'`
        )

        types.push(
          `${index === 0 && packIndex === 0 ? '' : ' |'}'${getComponentName(
            filename
          )}${capitalizeFirstLetter(pack)}'`
        )
      })
    )

    fs.writeFileSync(
      path.resolve('./', 'index.ts'),
      heading +
        '\n' +
        contents.join('\n') +
        `\n\nexport type FontAwesomeIcons = ` +
        types.join('\n')
    )
  }

  generateIndexFile()
}

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const heading = `// 🌊 this file is auto-generated by 404 Software's script. don't edit it.
// https://404-software.com`

run('solid')
run('brands')
run('regular')

// pascal case
const getComponentName = (filename: string) => {
  return filename
    .split('.')[0]
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      //   @ts-expect-error idk
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}
