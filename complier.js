function lexer(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
        let char = input[cursor];

        // skip whitespace
        if (/\s/.test(char)) {
            cursor++;
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let word = "";
            while (/[a-zA-Z0-9]/.test(char)) {
                word += char;
                char = input[++cursor];
            }

            // check for keywords
            if (word === "yo" || word === "vana") {
                tokens.push({ type: "keyword", value: word });
            }
            // test for identifier or variable
            else {
                tokens.push({ type: "identifier", value: word });
            }

            continue;
        }
        // test for number
        if (/[0-9]/.test(char)) {
            let num = "";
            while (/[0-9]/.test(char)) {
                num += char;
                char = input[++cursor];
            }
            tokens.push({ type: "number", value: parseInt(num) });
            continue;
        }

        // test for operator and equal to sign
        if(/[\+\-\*\/\=]/.test(char)) {
            tokens.push({ type: 'operator', value: char });
            cursor++;
            continue;
        }
    }
    return tokens;
}

function parser(tokens) {
    const ast = {
        type: "Program",
        body: []
    };

    while (tokens.length > 0) {
        let token = tokens.shift();

        if( token.type === 'keyword' && token.value === 'yo') {
            let declaration = {
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            }

            if (tokens[0].type === 'operator' && tokens[0].value === '=') {
                tokens.shift(); // eat the =
                let expression = ''; // initialize expression a+b
                while(tokens.length > 0 && tokens[0].type !== 'keyword') {
                    expression += tokens.shift().value;
                }
                declaration.value = expression.trim();
            }

            ast.body.push(declaration);
        }

        if (token.type === 'keyword' && token.value === 'vana') {
            ast.body.push({
                type: 'Print',
                expression: tokens.shift().value
            });
        }
    }
    return ast;
}

function codeGen(node) {
    switch (node.type) {
        case 'Program':
            return node.body.map(codeGen).join('\n');
        case 'Declaration':
            return `const ${node.name} = ${node.value};`
        case 'Print':
            return `console.log(${node.expression});`
    }
}

function compiler(input) {
    const tokens = lexer(input);
    const ast = parser(tokens);
    const executableCode = codeGen(ast);
    return executableCode;
}

function runner(input) {
    eval(input);
}

const code = `
yo x = 10
yo y = 20

yo sum = x / y
vana sum
`;

const exec = compiler(code);
runner(exec);