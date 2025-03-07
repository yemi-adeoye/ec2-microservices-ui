# Ui

This repo is for the demo frontend of a banking application

## Active Links

- Accounts: contains sub links to create account, view accounts, and perform self transfers
- Activity Logs: fetches and displays logs from the logging microservice

## Inactive Links

- Wealth Management
- Cards

## Worker

The worker periodically calls the users microservice and replaces the jwt token in the clients localstorage. Soon as the refresh token is invalid the user is logged out.
