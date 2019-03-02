help: ## Shows this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

watch:
	docker-compose run --rm --service-ports nodejs-watch
.PHONY: watch

test:
	docker-compose run --rm nodejs yarn run test
.PHONY: test