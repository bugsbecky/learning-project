# Beginner todo app: HTML/CSS/JS + Spring Boot + PostgreSQL
#
# One command (from this folder):
#   make
#
# Stops and recreates the stack if it is already running.

SHELL := /bin/bash
.DEFAULT_GOAL := start

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
COMPOSE := docker compose -f "$(ROOT)/docker-compose.yml"
PORT := 8080

.PHONY: start stop logs sql help

help:
	@echo "make        start everything (restarts if already running)"
	@echo "make stop   stop the app and PostgreSQL"
	@echo "make logs   follow Java / SQL logs"
	@echo "make sql    open a PostgreSQL prompt (\\dt then SELECT * FROM todos;)"

start:
	@echo "Restarting PostgreSQL + Spring Boot..."
	@$(COMPOSE) up -d --build --force-recreate --remove-orphans
	@echo "Waiting for http://localhost:$(PORT) ..."
	@ok=0; \
	for i in $$(seq 1 90); do \
		if curl -sf "http://localhost:$(PORT)/api/health" >/dev/null 2>&1; then ok=1; break; fi; \
		sleep 2; \
	done; \
	if [ "$$ok" != "1" ]; then \
		echo "App did not become ready. Last logs:"; \
		$(COMPOSE) logs --tail=80 app || true; \
		exit 1; \
	fi
	@echo ""
	@echo "Ready."
	@echo "  App:   http://localhost:$(PORT)"
	@echo "  API:   http://localhost:$(PORT)/api/todos"
	@echo "  Logs:  make logs"
	@echo "  SQL:   make sql"
	@echo "  Stop:  make stop"

stop:
	@$(COMPOSE) down
	@echo "Stopped."

logs:
	@$(COMPOSE) logs -f app

sql:
	@$(COMPOSE) exec db psql -U todo -d todo
