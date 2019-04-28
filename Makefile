ifneq ("$(wildcard ./.env)","")
	include .env
endif

DOCKER_PASSWORD_DECODED = $(shell echo $(DOCKER_PASSWORD)| base64 -D)

help: ## Shows this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

install:
	docker-compose run --rm nodejs yarn install
.PHONY: install

watch:
	docker-compose up -d mongo mongo-express
	docker-compose run --rm --service-ports nodejs-watch
.PHONY: watch

up:
	docker-compose run --rm nodejs yarn run build
	docker-compose up -d mongo nodejs-http
.PHONY: up

down:
	docker-compose down
.PHONY: down

test:
	docker-compose run --rm nodejs yarn run test
.PHONY: test

build-image:
	docker build -f docker/node-http/Dockerfile -t lissenburg/shinkansen-travel-node-http:latest .
.PHONY: build-image

build-dev-image:
	docker build -f docker/node-http/Dockerfile --target=dev  -t lissenburg/shinkansen-travel-node-http:dev .
.PHONY: build-dev-image

push-image:

	docker login -u '$(DOCKER_USER)' -p '${DOCKER_PASSWORD_DECODED}'
	docker push lissenburg/shinkansen-travel-node-http:latest
	docker logout
.PHONY: push-image

deploy:
	ssh -i ./deploy_key $(SSH_USER)@$(SSH_HOST) 'mkdir -p ~/www/shinkansen-travel/'
	scp -r deploy/vps/* $(SSH_USER)@$(SSH_HOST):~/www/shinkansen-travel/
	ssh -i ./deploy_key $(SSH_USER)@$(SSH_HOST) 'cd www/shinkansen-travel/ && sudo docker-compose pull && sudo docker-compose up -d'
.PHONY: deploy