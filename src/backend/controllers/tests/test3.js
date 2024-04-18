const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

//for ranking system, combine the ranks into one bigint using primes to the power of ranks
function calculateProduct(obj) {
    let product = 1;
    for (const [key, value] of Object.entries(obj)) {
        product *= Math.pow(parseInt(key), parseInt(value));
    }
    return product;
}

//for stv system, using a complex mathemtaical formula and prime numbers, combine the ranks to be able to be decoded to it's original form
function encodeObject(obj) {
    let combinedNumber = 1;
    Object.keys(obj).forEach((key, index) => {
        combinedNumber *= Math.pow(primes[index], obj[key]);
    });
    return combinedNumber;
}

const obj = { 2: 1, 3: 2, 6: 3 };
const f1 = calculateProduct(obj);
const f2 = encodeObject(obj);
console.log(f1);
console.log(f2);