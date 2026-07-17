import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    uni(),
    UnifiedViteWeappTailwindcssPlugin({
      rem2rpx: true,
    }),
  ],
})
