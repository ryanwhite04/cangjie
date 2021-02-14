
fetch('kCangjie.tsv').then(body => body.text())
    .then(text => text.split('\n'))
    .then(rows => rows.map(row => row.split('\t')))
    .then(chars => chars.reduce((chars, [code, cangjie]) => {
        chars[String.fromCodePoint(parseInt(code.slice(2), 16))] = cangjie;
        return chars;
    }, {}))
    .then(chars => {
        document.getElementById('chinese').addEventListener('change', update(chars));
    })
    .catch(console.error)

function update(chars) {
    return ({ currentTarget: { value } }) => {
        console.log('update', value);
        const cangjie = [...value].map(translate(chars)); 
        document.getElementById('cangjie').textContent = cangjie.join(' ');
        document.getElementById('explanation').replaceChildren(cangjie.map(explain).reduce(createList, document.createDocumentFragment()));
    }
}

function translate(chars) {
    return char => {
        console.log('translate', char);
        return chars[char];
    }
}

function explain(cangjie) {
    const radicals = [..."日月金木水火土竹戈十大中一弓人心手口尸廿山女田重卜*"];
    
    const mapping = radicals.reduce((a, char, i) => ({ ...a, [String.fromCodePoint(0x41+i)]: char }), {})
    const explanations = cangjie.split('').map(letter => mapping[letter]);
    console.log('explain', explanations);
    return explanations;
}

function createList(list, radicals) {
    console.log('createList', list, radicals);
    const item = document.createElement('li');
    item.textContent = radicals.join('');
    list.appendChild(item);
    return list;
}
