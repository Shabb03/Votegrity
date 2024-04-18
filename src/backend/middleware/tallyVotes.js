const db = require("../models/index.js");
const paillier = require("paillier-bigint");

async function addToMajorityTally(electionId, adminPublicKey, candidatePrime)
{
    const rankTallies = await db.RankTally.findAll({
        where: {
          electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
          electionId: electionId,
        },
    });
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    if (rankTallies.length != 0 || scoreTallies.length != 0)
    {
        return console.error(new Error("Wrong voting process used for tally."));
    }
    else if (tally == null)
    {
        return console.error(new Error("No tally associated with this election."));
    }
    else
    {
        
    }
}