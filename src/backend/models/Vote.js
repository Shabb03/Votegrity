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
        voterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Voter,
                key: 'id',
            },
        },
        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Candidate,
                key: 'id',
            },
        },
        blockId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: db.Block,
                key: 'id',
            },
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
            type: DataTypes.TEXT,
            allowNull: true,
        },
        encryptedVote: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });

    Vote.prototype.blindSignature = async function (adminPrivateKey) {
        const voterId = this.voterId;
        const candidateId = this.candidateId;

        const combinedVote = `${voterId},${candidateId}`;

        const blindedVote = BlindSignature.blind({
            message: combinedVote,
            N: adminPrivateKey.N,
            E: adminPrivateKey.E
        });

        this.blindedSignature = blindedVote.blinded;
        await this.save();
        return blindedVote.blinded;
    };

    Vote.prototype.encryptVote = async function (adminPublicKey) {
        const voterId = this.voterId;
        const candidateId = this.candidateId;

        const vote = `${voterId},${candidateId}`; // Combine voter ID and candidate ID

        const pk = new paillier.PublicKey(adminPublicKey.n, adminPublicKey.g);
        const encryptedVote = pk.encrypt(vote);

        this.encryptedVote = encryptedVote.toString();
        await this.save(); // Save encrypted vote in the database
        return encryptedVote.toString();
    };

    return Vote;
}