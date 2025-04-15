from dotenv import dotenv_values
import sys

ORANGE_COLOR = "\033[38;5;214m"
RESET_COLOR = "\033[0m"

WARNING_MSG = f"{ORANGE_COLOR}[ WARNING ]{RESET_COLOR}"

def main():
	
	# List the envs
	env = dotenv_values('.env')
	env_example = dotenv_values('.env.example')

	# Check the variables
	exit_value = 0
	for key, value in env_example.items():
		if key not in env:
			exit_value = 1
			print(f"{WARNING_MSG} Missing env variable '{key}'")
			continue
			
		if env[key] == '':
			exit_value = 1
			print(f"{WARNING_MSG} Missing value on key '{key}'")
			
	# Exit the program
	sys.exit(exit_value)


if __name__ == '__main__':
	main()