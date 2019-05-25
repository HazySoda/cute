import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import { getInput } from './util'

const entrys = getInput()

const baseConfig = {
  plugins: [
    resolve({
      extensions: ['.jsx', '.js']
    }),
    commonjs({
      exclude: 'src/**',
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
        ],
        ['@babel/plugin-proposal-class-properties', { "loose": true }],
      ]
    }),
    terser()
  ],
  // 是否开启代码分割
  experimentalCodeSplitting: true,
  external: ['react', 'antd', '@mandlazy/cute']
}

export default Object.keys(entrys).map(key => {
  const config = {
    input: entrys[key],
    ...baseConfig
  }
  if (key === 'index') {
    config.output = {
      format: 'es',
      file: 'es/index.js'
    }
    config.external = id => id.includes('./component')
  } else {
    config.output = {
      format: 'es',
      file: `es/component/${key}.js`
    }
  }
  console.log(config)
  return config 
})