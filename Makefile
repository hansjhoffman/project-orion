# Build configuration
# -------------------

APP_NAME = `node -p "require('./package.json').name"`
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`
GIT_REVISION = `git rev-parse HEAD`

# Introspection targets
# ---------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@printf "\n\033[34mEnvironment\033[0m\n"
	@printf "\033[34m---------------------------------------------------------------\033[0m\n"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_BRANCH"
	@printf "\033[35m%s\033[0m" $(GIT_BRANCH)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo ""

.PHONY: targets
targets:
	@printf "\n\033[34mTargets\033[0m\n"
	@printf "\033[34m---------------------------------------------------------------\033[0m\n"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# Development targets
# -------------------

.PHONY: build
build: ## Transpile TypeScript
	yarn esbuild src/index.ts --bundle --platform=node --target=node16 --minify --outdir=dist --out-extension:.js=.cjs.min.js

.PHONY: build-agent
build-agent: ## Transpile TypeScript
	yarn esbuild src/agent.ts --bundle --platform=node --target=node16 --minify --outdir=dist --out-extension:.js=.cjs.min.js

.PHONY: clean
clean: ## Remove build artifacts
	rm -rf dist

.PHONY: compile
compile: ## Run TypeScript compiler
	yarn tsc

.PHONY: deps
deps: ## Install all dependencies
	yarn install

.PHONY: format
format: format-ts ## Format ts,xml files

.PHONY: format-ts
format-ts: ## Format typescript files
	yarn prettier --write 'src/**/*.ts'

.PHONY: lint
lint: ## Lint code
	yarn eslint 'src/**/*.ts'

.PHONY: lint-fix
lint-fix: ## Lint code w/ fixes
	yarn eslint 'src/**/*.ts' --fix

.PHONY: run
run: build-agent build ## Run code
	node dist/main.cjs.min.js
