module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "brace-style": [
            "error", 
            "1tbs"
        ],
        "eol-last": [
            2, 
            "windows"
        ],
        "indent": [
            "error",
            4
        ],
        "no-trailing-spaces": [
            "error", 
            {
                "skipBlankLines": true
            }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
