<!-- Command List -->
1. npm init -y
2. npm install express --save
3. npm i -D typescript
4. npx tsc --init
5. npm i --save-dev @types/express
6. npm i -D tsx
7. add this line on package.json > script:
    "dev": "npx tsx watch ./src/server.ts"

8. tsConfig.json file changes:-
    <!-- Uncomment -->
    "rootDir": "./src",
    "outDir": "./dist",

    <!-- Comment -->
    // Other Outputs
        "sourceMap": true,
        "declaration": true,
        "declarationMap": true,

    // Recommended Options
        "jsx": "react-jsx",
        "verbatimModuleSyntax": true,
