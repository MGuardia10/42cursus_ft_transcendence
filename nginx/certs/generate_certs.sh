#!/bin/bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout key.pem \
	-out cert.pem \
	-subj "/C=ES/ST=Madrid/L=Madrid/O=42/OU=TECHNOLOGY/CN=localhost"
