# 🎨 React Native Font Awesome 6 Icons

```ts
import { WormSolid } from '@404-software/fontawesome'

export const Icon = () => <WormSolid />
```

## Overview

- 😎 Free, beautiful icons
- 🔥 Customizable with `react-native-svg` props
- 🌲 Tree-shaken components
- 🤖 TypeScript support
- 📈 JS-only (+ works with Expo)

## Installation

```sh
yarn add @404-software/fontawesome react-native-svg
```

## Usage

Each icon is exported as its own component with an adjusted name.

For example, to use the `angle-down` solid variant icon, import `AngleDownSolid`:

```tsx
import { AngleDownSolid } from '@404-software/fontawesome'
```

You can also `import * as FontAwesome`:

```tsx
import * as FontAwesome from '@404-software/fontawesome'

export const Icon = () => <FontAwesome.AngleDownSolid />
```

For a full directory of components, see the [FontAwesome](https://fontawesome.com/icons) website.

### Custom color

```tsx
<AngleDownSolid color="black" />
```

### Custom size

```tsx
<AngleDownSolid height={30} width={30} />
```

## Props

Each icon component accepts all the props from `react-native-svg`'s `Svg` component. Reference [their docs](https://github.com/react-native-svg/react-native-svg#svg).

## How it works

This library uses `react-native-svg`. The components are generated by `svgr`. I downloaded all the free icons from [fontawesome.com](https://fontawesome.com) and [ran a script](/generate/index.ts) to codegen the files from there.
