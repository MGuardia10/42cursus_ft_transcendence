#!/bin/bash

ORANGE="\033[38;5;214m"
RESET="\033[0m"
WARNING_MSG="${ORANGE}[ WARNING ]${RESET}"

# Check if .env and .env.example files exist
if [[ ! -f .env ]]; then
  echo -e "$WARNING_MSG File '.env' not found"
  exit 1
fi

if [[ ! -f .env.example ]]; then
  echo -e "$WARNING_MSG File '.env.example' not found"
  exit 1
fi

# Load .env and .env.example files as associative arrays
declare -A env
declare -A env_example

# Read .env into env array
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  env[$key]="$value"
done < .env

# Read .env.example into env_example array
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  env_example[$key]="$value"
done < .env.example

# Check for missing keys or empty values
exit_value=0
for key in "${!env_example[@]}"; do
  if [[ -z "${env[$key]+_}" ]]; then
    echo -e "$WARNING_MSG Missing env variable '$key'"
    exit_value=1
  elif [[ -z "${env[$key]}" ]]; then
    echo -e "$WARNING_MSG Missing value on key '$key'"
    exit_value=1
  fi
done

exit $exit_value
