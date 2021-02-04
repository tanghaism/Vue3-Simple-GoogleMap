import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

// 判断环境，生产环境会开启代码压缩
const isDev = process.env.NODE_ENV !== 'production'

// 插件
const plugins = [
  vue({
    // 把单文件组件中的样式，插入到html中的style标签
    css: false,
    // 把组件转换成 render 函数
    compileTemplate: true
  }),
  json(),
  babel({
    exclude: 'node_modules/**' // 只编译源代码
  }),
  nodeResolve(),
  postcss({
    // 把 css 插入到 style 中
    inject: true,
    // 把 css 放到和js同一目录
    // extract: true
  })
]

// 如果不是开发环境，开启压缩
isDev || plugins.push(commonjs(), terser({compress: {drop_console: true}, format: {comments: false}}))

module.exports = [{
  // 打包入口：拼接绝对路径
  input: 'src/index.js',
  // 配置打包出口
  output:[
    // {
    //   exports: 'auto',
    //   file: 'dist/iife/index.js',
    //   format: 'iife',
    //   name: "vue3SingleGooglemap",
    //     globals: {
    //       vue: 'Vue'
    //     }
    // },
    {
      exports: 'auto',
      file: "dist/index.js",
      format: 'es',
      name: "vue3SimpleGoogleMap",
      globals: {
        vue: 'Vue'
      }
    },
    // {
    //   exports: 'auto',
    //   file: "dist/cjs/index.js",
    //   format: 'cjs',
    //   name: "vue3SingleGooglemap",
    //   globals: {
    //     vue: 'Vue'
    //   }
    // },
    // {
    //   exports: 'auto',
    //   file: "dist/amd/index.js",
    //   format: 'amd',
    //   name: "vue3SingleGooglemap",
    //   globals: {
    //     vue: 'Vue'
    //   }
    // },
    // {
    //   exports: 'auto',
    //   file: "dist/umd/index.js",
    //   format: 'umd',
    //   name: "vue3SingleGooglemap",
    //   globals: {
    //     vue: 'Vue'
    //   }
    // },
  ],

  // 配置插件
  plugins: plugins,
  //  外链
  external: [
    'vue'
  ]
}]
