module.exports = {
   "env": {
      "browser": true,
      "commonjs": true,
      "es2021": true,
      "node": true,
      "jest": true
   },
   "extends": "eslint:recommended",
   "parserOptions": {
      "ecmaVersion": "latest"
   },
   "rules": {
      "indent": [
         "error",
         3
      ],
      "linebreak-style": [
         "error",
         "unix"
      ],
      "quotes": [
         "error",
         "double"
      ],
      "semi": [
         "error",
         "never"
      ]
   }
}
