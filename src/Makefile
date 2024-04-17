SERVER_DIR = backend
CLIENT_DIR = frontend
BLOCK_DIR = blockchain/contract
ADMIN_DIR = backend/middleware

install-backend:
	@echo "Installing server dependencies..."
	cd $(SERVER_DIR) && npm install

create-admin:
	cd $(ADMIN_DIR) && node createAdmin.js

install-frontend:
	@echo "Installing client dependencies..."
	cd $(CLIENT_DIR) && npm install

install-blockchain:
	@echo "Compiling Smart Contract..."
	cd $(BLOCK_DIR) && npx hardhat compile

test:
	@echo "Running tests..."
	cd $(SERVER_DIR) && npm test
	cd $(CLIENT_DIR) && npm test

start-backend:
	@echo "Starting server..."
	cd $(SERVER_DIR) && npm start

start-frontend:
	@echo "Starting client..."
	cd $(CLIENT_DIR) && npm run serve

start-blockchain:
	@echo "Deploying Smart Contract.."
	cd $(BLOCK_DIR) && npx hardhat run scripts/deploy.js

all: start-backend start-frontend

.DEFAULT_GOAL := all