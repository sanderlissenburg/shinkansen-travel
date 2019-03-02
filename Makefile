help: ## Shows this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

watch:
	docker-compose up -d mongo mongo-express
	docker-compose run --rm --service-ports nodejs-watch
.PHONY: watch

up:
	docker-compose run --rm nodejs yarn run build
	docker-compose up -d mongo mongo-express
	## TEMP FIX TO PREVENT unavailable mongodb
	sleep 5
	##
	docker-compose up -d nodejs-http

down:
	docker-compose down

test:
	docker-compose run --rm nodejs yarn run test
.PHONY: test