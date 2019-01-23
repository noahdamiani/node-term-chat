all: serve

server: 
	@cd server && yarn start

serve:
	@cd server && yarn start & ./scripts/multi

client: 
	@cd client && yarn start
