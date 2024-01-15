const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'votegirty',      // Replace with your MySQL server host
    username: 'sidhur2',  // Replace with your MySQL username
    password: 'PASSWORD',  // Replace with your MySQL password
    database: 'votegrity',  // Replace with your desired database name
});



const Voter = sequelize.define('Voter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    specialNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    citizenship: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    authenticated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    voted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    privateKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    securityQuestion1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    securityAnswer1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    securityQuestion2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    securityAnswer2: {
        type: DataTypes.STRING,
        allowNull: false,
    },

});

const Candidate = sequelize.define('Candidate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    voice: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    party: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    biography: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

const Admin = sequelize.define('Admin', {
-id
-email
-password
-privateKey
-publicKey
});

const Vote = sequelize.define('Vote', {
-id
-voterId
-candidateId
-blockId
});

const Transaction = sequelize.define('Transaction', {
-id
-blockId
-candidateId
-voterId
-privateKey
-publicKey
-signature
});

const Block = sequelize.define('Block', {
-id
-previousHash
-proof
-timestamp
-hash
});

const Blockchain = sequelize.define('Blockchain', {
-id
-chain
});

const Election = sequelize.define('Election', {
-id
-title
-description
-startDate
-endDate
-resultDate
-candidateNumber
-ageRestriction
-authenticationMethod
-privateKey
-publicKey
});

const VoteInformation = sequelize.define('VoteInformation', {
-id
-daysLeft
-voteCount
});

const Result = sequelize.define('Result', {
-id
-winner
-voteCount
});


// Synchronize the models with the database (create tables)
async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables synchronized successfully');
  } catch (err) {
    console.error('Error synchronizing tables:', err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
