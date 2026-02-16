import { defineConfig, isDev } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/desk'

import { visionTool } from '@sanity/vision'
import myLogo from './sanity/icons/defaultLogo'

import { imageHotspotArrayPlugin } from 'sanity-plugin-hotspot-array'
import { media, mediaAssetSource } from 'sanity-plugin-media'


const devOnlyPlugins = [visionTool({ name: 'groq-developer', title: 'GROQ Debugger' })]


export default defineConfig({
  name: 'AMA',
  title: 'Website Admin',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  basePath: "/admin",
  icon: myLogo,

  plugins: [
    structureTool({ structure, title: 'Website Content' }),
    imageHotspotArrayPlugin(),
    media(),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
      },
    },
  },
})