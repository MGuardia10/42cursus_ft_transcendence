from dotenv import dotenv_values
import sys

def main():
	
	# List the envs
	env = dotenv_values('.env')
	env_example = dotenv_values('.env.example')

	# Check the variables
	exit_value = 0
	for key, value in env_example.items():
		if key not in env:
			exit_value = 1
			break
			
		if env[key] == '':
			exit_value = 2
			break
	
	# Exit the program
	sys.exit(exit_value)


if __name__ == '__main__':
	main()