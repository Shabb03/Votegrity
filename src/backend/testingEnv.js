require("fast-prime")

console.log(primes().primes);
let primeNo = primes(2, 50);
console.log(primeNo);
primeNo = primeGenerator({ min: 2, max: 50 });
console.log(primeNo);