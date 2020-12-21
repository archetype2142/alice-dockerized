FROM ubuntu:latest
RUN apt update && apt install nodejs -y
RUN mkdir -p /home/alice_all

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN apt-get update
WORKDIR /home/alice_all
COPY . .
RUN chmod +x execute
RUN cp execute /usr/bin/
WORKDIR /home/alice_all/simple-socker
RUN npm install
WORKDIR /home/alice_all/alice-front
RUN npm install
EXPOSE 3000 80
CMD ["bash", "execute"]
