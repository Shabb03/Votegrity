require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: process.env.SQL_PASSWORD,
    database: 'votegrity',
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
        allowNull: true,
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
        allowNull: true,
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    securityQuestion1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    securityAnswer1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    securityQuestion2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    securityAnswer2: {
        type: DataTypes.STRING,
        allowNull: true,
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
        allowNull: true,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    biography: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    privateKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

const Block = sequelize.define('Block', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    /*
    previousHash: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
              model: Block,
              key: 'hash',
        },
    },
    */
    previousHash: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    proof: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

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
              model: Voter,
              key: 'id',
        },
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
              model: Candidate,
              key: 'id',
        },
    },
    blockId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
              model: Block,
              key: 'id',
        },
    },
});

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    blockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
              model: Block,
              key: 'id',
        },
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
              model: Candidate,
              key: 'id',
        },
    },
    voterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
              model: Voter,
              key: 'id',
        },
    },
    privateKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    signature: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

const Blockchain = sequelize.define('Blockchain', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chain: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
              model: Block,
              key: 'id',
        },
    },
});

const Election = sequelize.define('Election', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    resultDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    candidateNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ageRestriction: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authenticationMethod: {
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
    }
});

const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
              model: Candidate,
              key: 'id',
        },
    },
    voteCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});



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