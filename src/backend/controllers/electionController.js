const sendEmail = require('./thirdParty/email');
const { generatePublishKey } = require('./functions/generateCode');
const db = require('../models/index.js');
const countryData = require('../assets/citizenship.json');
const votingProcess = require('../assets/process.json');
const { where } = require('sequelize');
const primes = require('fast-primes');

//Create a new election
exports.addElection = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Admin.findByPk(userId);

        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authEmail, authCitizenship, type } = req.body;
        if (!title || !description || !startDate || !endDate || !resultDate || !candidateNumber || !type) {
            return res.json({ error: 'All required inputs not provided' });
        }
        if (authCitizenship !== null && !countryData.includes(authCitizenship)) {
            return res.json({ error: 'Incorrect citizenship provided' });
        }
        if (type !== null && !votingProcess.includes(type)) {
            return res.json({ error: 'Incorrect election voting process provided' });
        }
        const publishKey = await generatePublishKey();
        sendEmail("Election Publish Key", user.email, "Here is your code to publish your new election " + title + ": " + publishKey);
        const newElection = await db.Election.create({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            resultDate: resultDate,
            candidateNumber: candidateNumber,
            ageRestriction: ageRestriction,
            authEmail: authEmail,
            authCitizenship: authCitizenship,
            type: type,
            publishKey: publishKey,
            adminId: userId,
        });
        res.json({ election: newElection.title, message: 'Election created successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get a list of all new elections where the number of added candidates is less than the required number of candidates
exports.getNewElections = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'candidateNumber'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        const result = await Promise.all(activeElections.map(async (election) => {
            const addedCandidates = await db.Candidate.count({
                where: {
                    electionId: election.id,
                },
            });
            if (election.candidateNumber > addedCandidates) {
                return {
                    id: election.id,
                    title: election.title,
                    candidateNumber: election.candidateNumber,
                    addedCandidates: addedCandidates,
                };
            }
            else { return null; }
        }));
        const filteredResult = result.filter(election => election !== null);
        res.json({ activeElections: filteredResult });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Add a new candidate to the newly created election
exports.addCandidate = async (req, res) => {
    try {
        const { name, voice, party, dateOfBirth, biography, electionId } = req.body;
        if (!name || !voice || !party || !dateOfBirth || !biography || !electionId) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const activeElection = await db.Election.findByPk(electionId);
        const candidateCount = activeElection.candidateCount;
        const totalCandidates = await db.Candidate.count({ where: { electionId: electionId } });
        if (totalCandidates >= candidateCount) {
            return res.json({ error: "Total number of candidates exceeded" });
        }
        const image = req.file;
        const imagePath = image.filename;

        const primeNo = primes.range.fast(2, 50);

        const candidatesWithSamePrime = db.Candidate.findAll({
        where: {
            primeNumber: primeNo
        }
        });

        while (candidatesWithSamePrime.length != 0)
        {
            primeNo = primeGenerator({min:2, max: 50});
            candidatesWithSamePrime = db.Candidate.findAll({
                where: {
                    primeNumber: primeNo
                }
            });
        }

        const newCandidate = await db.Candidate.create({
            name: name,
            voice: voice,
            party: party,
            image: imagePath,
            dateOfBirth: dateOfBirth,
            biography: biography,
            electionId: electionId,
            primeNumber: primeNo,
        });
        res.json({ candidate: newCandidate, message: 'Candidate created successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
