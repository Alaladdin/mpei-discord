module.exports = {
  env: {
    commonjs: true,
    es2021  : true,
    node    : true,
  },
  extends      : ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['regex'],
  rules  : {
    'no-console'     : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger'    : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': ['warn', 'windows'],
    'key-spacing'    : ['error', { align: 'colon' }],
  },
};
