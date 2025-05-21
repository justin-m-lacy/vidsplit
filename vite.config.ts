import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import autoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from "vite-plugin-html";

const getApiBase = (url?: string) => {

  if (url == null) {
    return 'localhost';
  }
  const portIndex = url.lastIndexOf(':');
  return portIndex > 0 ? url.substring(0, portIndex) : url;

}

// https://vitejs.dev/config/
export default async function ({ mode, command }) {

  const isDev = mode !== 'production';

  const origins = ["'self'", ""].filter(v => v != null).join(" ");

  const api_base = getApiBase(process.env.VITE_API_BASE);

  const securityPolicies = [
    `default-src ${origins}`,
    `connect-src ${origins} ${api_base}`,
    `img-src ${origins} 'unsafe-inline'`,
    `script-src ${origins} 'unsafe-eval'`,
    `font-src ${origins} unsafe-inline`,
    `style-src ${origins} 'unsafe-inline'`,
  ];

  return defineConfig({

    build: {
      outDir: path.resolve(__dirname, 'app/render'),
      minify: 'terser',
      rollupOptions: {
        plugins: [
          /* zipPack({
             outDir: './'
           }),*/
        ]
      },
      terserOptions: {
        keep_classnames: false,
        keep_fnames: false,
        ecma: 2020,
        sourceMap: true,
        compress: {
          arrows: true,
          arguments: true,
          booleans: true,
          booleans_as_integers: false,
          collapse_vars: true,
          comparisons: false,
          computed_props: true,
          conditionals: true,
          dead_code: true,
          directives: false,
          evaluate: true,
          inline: 1,
          keep_fargs: false,
          keep_fnames: true,
        },

        mangle: {
          /*keep_fnames: false,
          keep_classnames: false,
          module: true,
          reserved: await readKeys(),
          properties: {
            debug: false,
            keep_quoted: true,
          },
*/
        },

      }
    },
    base: './',
    resolve: {
      alias: [
        { find: /^@\//, replacement: `${resolve(__dirname, './src')}/` },
        { find: /^assets\//, replacement: `${resolve(__dirname, './assets')}/` },
      ]
    },

    define: {
      //"__INTLIFY_PROD_DEVTOOLS__": false,
      //"__VUE_I18N_LEGACY_API__": false
      /// @note The quotes around the variable value are necessary.
      //"import.meta.env.build_variable": `"${buildVar}"`
    },

    plugins: [

      tailwindcss(),
      createHtmlPlugin({
        inject: {
          data: {
            contentSecurityPolicy: securityPolicies.join("; "),
          },
        },
      }),
      vue(),

      // auto-import listed packages
      autoImport({
        dts: resolve(__dirname, 'src/auto-imports.d.ts'),
        imports: ["vue"]

      }),

    ],

    optimizeDeps: {

      include: [
        "vue",
        "@vueuse/core",

      ]
    },

    preview: {
      port: 5000,
      cors: true,
    },


    server: {
      port: 3001,
      cors: true,
      hmr: process.env.SILENT ? false : {
        host: 'localhost'
      },
      watch: {
        ignored: [
          resolve(__dirname, "src/auto-imports.d.ts"),
          resolve(__dirname, "src/components.d.ts")
        ],
      },
    }

  });
}