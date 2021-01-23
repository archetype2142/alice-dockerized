# Alice Dockerized
Run instructions:
   
    docker-compose build
    docker-compose up

## Modifications
To change the event file, append argument to the command in `simple-socker` service in `docker-compose.yml` file

By default the file `event4047_run226466.json` is used, **only append file name and not the whole path**

All files availabe are located in `alice_container/events/` folder

### example: 

To run the event file `event769_run122374.json` in the folder `alice_container/events/`, modify the `docker-compose.yml` file

FROM:

    command: node /home/alice_all/simple-socker/app.js

TO:

    command: node /home/alice_all/simple-socker/app.js event769_run122374.json
    
AND run the `docker-compose up` command again
