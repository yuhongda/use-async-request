import dts from 'rollup-plugin-dts';

const config = {
  input: './src/index.ts',
  output: { format: 'es' },
  plugins: [dts()]
};

export default config;