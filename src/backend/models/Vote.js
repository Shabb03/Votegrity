const { DataTypes } = require('sequelize');
const db = require('./index.js');
const paillier = require('paillier-bigint');
const BlindSignature = require('blind-signatures');

module.exports = (sequelize) => {
    const Vote = sequelize.define('Vote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        electionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Election,
                key: 'id',
            },
        },
        blindedSignature: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        encryptedVote: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    });

    Vote.prototype.blindSignature = async function (adminPrivateKey, encryptedVote) {

        const blindedVote = blindSignatures.blind({
            message: encryptedVote,
            N: adminPrivateKey.N,
            E: adminPrivateKey.E
        });

        this.blindedSignature = blindedVote.blinded;
        await this.save();
        return blindedVote.blinded;
    };

    Vote.prototype.encryptVoteForMajority = async function (adminPublicKey, primeNumber) {
        const pk = new paillier.PublicKey(adminPublicKey);
        const vote = Math.pow(10, primeNumber);
        const encryptedVote = pk.encrypt(vote);
        
        this.encryptedVote = encryptedVote;
        await this.save();
        return encryptedVote;
    };

    return Vote;
}