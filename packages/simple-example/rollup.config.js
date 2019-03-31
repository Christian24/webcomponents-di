import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: './src/main.ts',
    output: {
        file: './dist/main.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        typescript(),
        resolve()
    ]
}