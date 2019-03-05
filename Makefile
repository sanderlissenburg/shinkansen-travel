ifneq ("$(wildcard ./.env)","")
	include .env
endif

help: ## Shows this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

install:
	docker-compose run --rm nodejs yarn install

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
.PHONY: up

down:
	docker-compose down
.PHONY: down

test:
	docker-compose run --rm nodejs yarn run test
.PHONY: test

build-image:
	docker build -f docker/node-http/Dockerfile -t lissenburg/shinkansen-travel-node-http  .
.PHONY: build-image

build-dev-image:
	docker build -f docker/node-http/Dockerfile --target=dev  -t lissenburg/shinkansen-travel-node-http:dev .
.PHONY: build-dev-image

push-image:
	docker login -u '$(DOCKER_USER)' -p '$(DOCKER_PASSWORD)'
	docker push lissenburg/shinkansen-travel-node-http
	docker logout
.PHONY: push-image