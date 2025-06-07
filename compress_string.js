// Используем метод дельта-кодирования

function serialize(numbers) {
    if (!numbers || numbers.length === 0) {
        return "";
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const deltas = [];
    let prev = 0;
    for (const num of sorted) {
        deltas.push(num - prev);
        prev = num;
    }

    let bitString = "";
    for (const delta of deltas) {
        if (delta <= 63) {
            bitString += '0' + delta.toString(2).padStart(6, '0');
        } else {
            bitString += '1' + delta.toString(2).padStart(14, '0');
        }
    }

    const padding = (8 - (bitString.length % 8)) % 8;
    bitString += '0'.repeat(padding);

    const byteArray = new Uint8Array(Math.ceil(bitString.length / 8));
    for (let i = 0; i < bitString.length; i += 8) {
        const byteStr = bitString.substr(i, 8);
        byteArray[i / 8] = parseInt(byteStr, 2);
    }

    return btoa(String.fromCharCode(...byteArray));
}

function deserialize(s) {
    if (!s || s.length === 0) {
        return [];
    }

    const byteString = atob(s);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    let bitString = "";
    for (const byte of byteArray) {
        bitString += byte.toString(2).padStart(8, '0');
    }

    const deltas = [];
    let i = 0;
    while (i < bitString.length) {
        if (bitString[i] === '0') {
            if (i + 7 > bitString.length) break;
            const delta = parseInt(bitString.substr(i + 1, 6), 2);
            deltas.push(delta);
            i += 7;
        } else if (bitString[i] === '1') {
            if (i + 15 > bitString.length) break;
            const delta = parseInt(bitString.substr(i + 1, 14), 2);
            deltas.push(delta);
            i += 15;
        } else {
            break;
        }
    }

    const numbers = [];
    let prev = 0;
    for (const delta of deltas) {
        prev += delta;
        numbers.push(prev);
    }

    return numbers;
}

function generateNumbers(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 300) + 1);
    }
    return numbers;
}

function simpleSerialize(numbers) {
    /*
    const array = [];
    for (let i = 0; i < numbers.length; i++) {
       array.push(numbers[i].toString());
    }
    return array.join("");
    */
    return JSON.stringify(numbers);
}
function testSimple(n) {
    const numbers = generateNumbers(n);
    const serialized = serialize(numbers);
    const numbersStrSimple = simpleSerialize(numbers);
    const jsonLength = numbersStrSimple.length;
    const compressionRatio = serialized.length / jsonLength;

    console.log(numbersStrSimple, serialized, `compress ratio: ${compressionRatio}`)
}

function testOneSign(n) {
    const test = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 1);
    const serialized = serialize(test);
    const numbersStrSimple = simpleSerialize(test);
    const ratio = serialized.length / simpleSerialize(test).length;
    console.log(numbersStrSimple, serialized, `compress ratio: ${ratio}`)
}

function testTwoSign(n) {
    const test = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    const serialized = serialize(test);
    const numbersStrSimple = simpleSerialize(test);
    const ratio = serialized.length / simpleSerialize(test).length;
    console.log(numbersStrSimple, serialized, `compress ratio: ${ratio}`)
}

function testThreeSign(n) {
    const test = Array.from({ length: n }, () => Math.floor(Math.random() * 201) + 100);
    const serialized = serialize(test);
    const numbersStrSimple = simpleSerialize(test);
    const ratio = serialized.length / simpleSerialize(test).length;
    console.log(numbersStrSimple, serialized, `compress ratio: ${ratio}`)
}

function testAllThreeSign(n) {
    const test = [];
    for (let i = 1; i <= n; i++) {
        test.push(i, i, i);
    }
    const serialized = serialize(test);
    const numbersStrSimple = simpleSerialize(test);
    const ratio = serialized.length / simpleSerialize(test).length;
    console.log(numbersStrSimple, serialized, `compress ratio: ${ratio}`)
}

console.log("____________________________")
testSimple(50);
console.log("____________________________")
testSimple(500);
console.log("____________________________")
testSimple(1000);
console.log("____________________________")
testOneSign(100);
console.log("____________________________")
testTwoSign(100);
console.log("____________________________")
testThreeSign(100);
console.log("____________________________")
testAllThreeSign(300);

