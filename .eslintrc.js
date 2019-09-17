module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'import/extensions': ['error', 'always', {
		  js: 'never',
		  vue: 'never'
		}],
		'no-param-reassign': ['error', {
		  props: true,
		  ignorePropertyModificationsFor: [
		    'state', // for vuex state
		    'acc', // for reduce accumulators
		    'e' // for e.returnvalue
		  ]
		}],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': ['error', {
		  optionalDependencies: ['test/unit/index.js']
		}],
		"arrow-body-style": [
		  2,
		  "as-needed",
		  {
		    "requireReturnForObjectLiteral": true
		  }
		],
		"comma-dangle": [
		  2,
		  "always-multiline"
		],
		"linebreak-style": [
		  "error",
		  "unix"
		],
		"no-tabs": 0,
		"no-param-reassign": [
		  "error",
		  {
		    "props": false
		  }
		],
		"no-constant-condition": [
		  "error",
		  {
		    "checkLoops": false
		  }
		],
		"no-restricted-syntax": 0,
		"object-shorthand": 0,
		"prefer-destructuring": 0,
		"no-unused-vars": [2, {
		  "args": "none"
		}],
		"import/imports-first": 0,
		"import/newline-after-import": 0,
		"import/no-dynamic-require": 0,
		"import/no-extraneous-dependencies": 0,
		"import/no-named-as-default": 0,
		"import/no-unresolved": 0,
		"import/prefer-default-export": 0,
		"import/extensions": 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
