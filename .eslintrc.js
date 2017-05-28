module.exports = {
    "env": {
        "browser": false,
        "node": true,
        "es6": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "script",
        "impliedStrict": false
    },
    "plugins": ["node"],
    "extends": [
        "eslint:recommended",
        "plugin:node/recommended"
    ],
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": ["off"],
        "node/exports-style": ["error", "module.exports"],
        "strict": ["error", "global"]
    }
};