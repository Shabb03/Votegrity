const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const keyFunctions = require('../middleware/keyFunctions');
const db = require('../models/index.js');
const paillier = require('paillier-bigint');
const crypto = require('crypto');
const { Wallet } = require('ethers');
const fs = require('fs');;
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const BlindSignature = require('blind-signatures');

const contractABI = require('../../blockchain/contract/artifacts/contracts/Vote.sol/Vote.json');
//const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractAddress = process.env.CONTRACT_ADDRESS;

const dotenv = require('dotenv');
dotenv.config();

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

exports.gettest = async (req, res) => {
    try {
        //return res.json({ message: "done" });
        const electionId = 2;
        //const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
        //const votes = await contract.methods.getVotes(electionId);

        const allEncryptedVotes = [];
        const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

        //const totalVotes = await contract.methods.getVotes(2).call({ from: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E' });
        //const totalVotes = await contract.methods.test().call({ from: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E' });

        /*
        await contract.methods.test().call({ from: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E' })
            .then(function (result) {
                console.log(result)
            });
        */

        const votes = await contract.methods.getEncryptedVotes(electionId).call();

        console.log("\n\n", votes);
        //await contract.methods.test().call().then(console.log);

        //console.log("\n\n", totalVotes, "\n\n");

        /*
        for (let i = 0; i < totalVotes; i++) {
            const encryptedVote = await contract.methods.allBallots(i).call();
            allEncryptedVotes.push(encryptedVote.encryptedVote);
        }
        */

        //console.log("All Encrypted Votes:", allEncryptedVotes);

        //contract.methods.submitBallot(encryptedVote, bS, electionId).send({ from: `${user.walletAddress}` })
        //console.log(votes);

        return res.json({ message: "done" });


        /*
        function extractArray(x, y) { //y=final answer
            const originalArray = [];
            let remainingY = y;

            // Start with the largest exponent (3^3)
            for (let exponent = x; exponent >= 1; exponent--) {
                const currentPower = Math.pow(x, exponent);
                const count = Math.floor(remainingY / currentPower);
                originalArray.push(...Array(count).fill(exponent));
                remainingY -= count * currentPower;
            }
            const total = originalArray.reduce((total, num) => total + num, 0)
            return total;
        }

        function totalVotes(bigInt, n) {
            const bigIntStr = bigInt.toString();
            const result = {};
            for (let i = 0; i < n; i++) {
                const start = -6 * (i + 1);
                const end = -6 * i;
                const stringNum = bigIntStr.slice(start, end);
                const prime = primes[i]
                const num = extractArray(prime, parseInt(stringNum));
                result[prime] = num;
            }
            return result;
        }

        function sumObjects(objects) {
            const sums = {};
            for (const obj of objects) {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        const value = obj[key];
                        sums[key] = (sums[key] || 0) + value;
                    }
                }
            }
            return sums;
        }

        function processObject(obj) {
            const keys = Object.keys(obj).map(Number).sort((a, b) => b - a);
            const result = keys.map(key => {
                const value = obj[key];
                const powered = BigInt(key ** value);
                const padded = powered.toString().padStart(3, '0');
                return padded;
            });
            return result.join('');
        }

        function stringToBigInt(str) {
            return BigInt(str);
        }

        const obj1 = { 2: 2, 3: 1, 5: 3 };
        const obj2 = { 2: 2, 3: 1, 5: 3 };
        const obj3 = { 2: 1, 3: 2, 5: 3 };
        const obj4 = { 2: 1, 3: 3, 5: 2 };

        // Process the object
        const processedStr1 = processObject(obj1);
        const processedStr2 = processObject(obj2);
        const processedStr3 = processObject(obj3);
        const processedStr4 = processObject(obj4);
        console.log("\nProcessed String:", processedStr1, processedStr2, processedStr3, processedStr4);

        // Convert combined string to BigInt
        const bigIntValue1 = stringToBigInt(processedStr1);
        const bigIntValue2 = stringToBigInt(processedStr2);
        const bigIntValue3 = stringToBigInt(processedStr3);
        const bigIntValue4 = stringToBigInt(processedStr4);
        console.log("\nBigInt Value:", bigIntValue1, bigIntValue2, bigIntValue3, bigIntValue4);

        const { publicKey, privateKey } = await paillier.generateRandomKeys(2048);

        const b1 = publicKey.encrypt(bigIntValue1);
        const b2 = publicKey.encrypt(bigIntValue2);
        const b3 = publicKey.encrypt(bigIntValue3);
        const b4 = publicKey.encrypt(bigIntValue4);

        let sum1 = publicKey.addition(b1, b2);
        let sum2 = publicKey.addition(sum1, b3);
        let sum3 = publicKey.addition(sum2, b4);

        const final = privateKey.decrypt(sum3);
        console.log("\nfinal", final);

        const objs = [obj1, obj2, obj3, obj4];
        const sums = sumObjects(objs);
        console.log("\nSUMS:", sums);

        const result = totalVotes(final);
        console.log("\nRESULT:", result);
        */


        /*
        async function main() {
          // Generate public and private keys
          const { publicKey, privateKey } = await generateRandomKeys(2048);
        
          // Example data: multiple objects with values for each key
          const data = [
            { '2': 3, '3': 1, '4': 2 },
            { '2': 1, '3': 2, '4': 3 },
            { '2': 1, '3': 2, '4': 3 }
            // Add more objects as needed
          ];
        
          // Initialize encrypted sums for each key
          let encryptedSums = {
            '2': publicKey.encrypt(BigInt(0)),
            '3': publicKey.encrypt(BigInt(0)),
            '4': publicKey.encrypt(BigInt(0))
          };
        
          console.log("\n\nencryptedSums", encryptedSums)
        
          // Perform homomorphic addition for each key across all objects
          console.log("\n\ndata.ForEach");
          data.forEach(obj => {
            console.log("\nobj", obj);
            for (let key in obj) {
              console.log("key", key);
              encryptedSums[key] = publicKey.addition(encryptedSums[key], publicKey.encrypt(BigInt(obj[key])));
            }
            console.log("encryptedSums", encryptedSums);
          });
        
          // Decrypt the sums for each key
          console.log("\n\ndecryptedSums");
          let decryptedSums = {};
          for (let key in encryptedSums) {
            console.log("key", key);
            decryptedSums[key] = privateKey.decrypt(encryptedSums[key]).toString();
            console.log(decryptedSums);
          }
        
          console.log('\n\nDecrypted Sums by Key:', decryptedSums);
        }
        
        main().catch(console.error);
        */



        /*
        let objs = [{2: 2, 3: 1, 4: 3}, {2: 1, 3: 2, 4: 3}, {2: 2, 3: 3, 4: 1}];
        let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        
        // Function to get the next prime number
        function getNextPrime(n) {
            for (let i = n + 1; ; i++) {
                if (primes.includes(i)) {
                    return i;
                }
            }
        }
        
        // Function to factorize a BigInt into its prime factors
        function factorize(n) {
    let factors = [];
    for (let i = 0; i < primes.length; i++) {
        while (n % BigInt(primes[i]) === BigInt(0)) {
            factors.push(primes[i]);
            n /= BigInt(primes[i]);
        }
    }
    return factors;
}

// Combine keys and values of each object into a BigInt
let combineds = [];
let primeToKey = {};
let primeToValue = {};
let primeIndex = 0;
for (let obj of objs) {
    let combined = BigInt(1);
    for (let key in obj) {
        let primeForKey = getNextPrime(parseInt(key));
        let primeForValue = getNextPrime(obj[key]);
        // Ensure the maps are not overwritten
        if (!primeToKey[primeForKey]) {
            primeToKey[primeForKey] = parseInt(key);
        }
        if (!primeToValue[primeForValue]) {
            primeToValue[primeForValue] = obj[key];
        }
        combined *= BigInt(primeForKey * primeForValue);
    }
    combineds.push(combined);
}

console.log('Combined BigInts:', combineds);

// Parse each combined BigInt back into an object and get total ranking for user id 2
let totalRankingForUser2 = 0;
for (let combined of combineds) {
    let factors = factorize(combined);
    let reverted = {};
    for (let i = 0; i < factors.length; i += 2) {
        let key = primeToKey[factors[i]];
        let value = primeToValue[factors[i + 1]];
        reverted[key] = value;
        if (key === 2) {
            totalRankingForUser2 += value;
        }
    }
    console.log('Reverted object:', reverted);
}

console.log('Total ranking for user id 2:', totalRankingForUser2);
*/
        return res.json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.posttest = async (req, res) => {
    try {
        //return res.json({ message: "done" });
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

        /*
        const paillierKeys = await paillier.generateRandomKeys(2048);
        const stringPublic = paillierKeys.publicKey.n.toString() + '#' + paillierKeys.publicKey.g.toString();
        const stringPrivate = paillierKeys.privateKey.lambda.toString() + '#' + paillierKeys.privateKey.mu.toString();

        const { keyPair } = BlindSignature.keyGeneration({ b: 2048 });
        const blindPrivateKey = keyPair.n.toString() + '#' + keyPair.e.toString();

        const admin = await db.Admin.findByPk(1);
        admin.blindPublicKey = null;
        admin.blindPrivateKey = blindPrivateKey;
        admin.paillierPublicKey = stringPublic;
        admin.paillierPrivateKey = stringPrivate;
        await admin.save();
        */

        /*
        const parts = stringPublic.split('#');
        const n = BigInt(parts[0]);
        const g = BigInt(parts[1]);
        const newPublicKey = new paillier.PublicKey(n, g);
        console.log("\n\n", newPublicKey);
        const encryptedVote = newPublicKey.encrypt("hello");
        console.log("\n\n", encryptedVote.toString());
        */

        //const newPublicKey = new paillier.PublicKey(paillierKeys.publicKey.n, paillierKeys.publicKey.g);
        //const newPrivateKey = new paillier.PrivateKey(paillierKeys.privateKey.lambda, paillierKeys.privateKey.mu, newPublicKey);

        return res.json({ message: "done" });

        /*
        const { keyPair } = BlindSignature.keyGeneration({ b: 2048 });
        //console.log(keyPair);

        const { blinded, r } = BlindSignature.blind({
            message: "hello!",
            N: keyPair.n.toString(),
            E: keyPair.e.toString(),
        });
        //console.log("\n\nblinded:", blinded);
        //console.log("\n\nr:", r);
        console.log("\n\nn", keyPair.n.toString());
        console.log("\n\ne", keyPair.e.toString());

        return res.json({ message: "done" });
        */

        /*
        // key creation for admins used for the paillier encryption and blind signature implementation
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        });
        const blindPublicKey = publicKey;
        const blindPrivateKey = privateKey;

        const keypair = await BlindSignature.keyGeneration();
        const bpublicKey = keypair.publicKey;
        const bprivateKey = keypair.privateKey;
        console.log(bpublicKey, bprivateKey);
        */

        //const keyPair = await BlindSignature.keyGeneration({ b: 2048 });
        //console.log(keyPair);

        //const blindKeys = BlindSignature.keyGeneration({ b: 2048 });
        //console.log("\n\n", blindKeys.keyPair.n);
        //console.log("\n\n", blindKeys.keyPair.e);

        //const paillierKeys = await paillier.generateRandomKeys(2048);

        //const admin = await db.Admin.findByPk(1);
        //admin.paillierPublicKey = paillierKeys.publicKey;
        //admin.paillierPrivateKey = paillierKeys.privateKey;
        console.log(paillierKeys.publicKey);
        console.log(paillierKeys.privateKey);
        //await admin.save();

        console.log(`\n\nAdmin created successfully\n`);

        return res.json({ message: "done" });

        /*
        const candidates = await db.Candidate.findAll({
            where: { electionId: 2 },
            attributes: ['id'],
            order: [['id', 'ASC']]
        });
        const candidateIds = candidates.map(candidate => candidate.id);
        console.log(candidateIds);
        */
        return res.json({ message: "done" });



        function encodeObject(obj) {
            let combinedNumber = 1;
            Object.keys(obj).forEach((key, index) => {
                console.log("encodeObject");
                console.log(key, index);
                console.log(primes[index], obj[key]);
                combinedNumber *= Math.pow(primes[index], obj[key]);
            });
            return combinedNumber;
        }

        function decodeNumber(number) {
            let obj = {};
            primes.forEach((prime, index) => {
                //console.log("decodeNumber");
                //console.log(prime, index);
                let exponent = 0;
                while (number % prime === 0) {
                    exponent++;
                    number /= prime;
                }
                if (exponent > 0) {
                    //console.log(index, index + 2);
                    obj[prime] = exponent;
                }
            });
            return obj;
        }

        //const originalObject = {2: 2, 3: 1, 4: 3};
        const { originalObject } = req.body;
        const encodedNumber = encodeObject(originalObject);
        console.log('Encoded Number:', encodedNumber);

        const decodedObject = decodeNumber(encodedNumber);
        console.log('Decoded Object:', decodedObject);

        res.json({ vote: "done" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}