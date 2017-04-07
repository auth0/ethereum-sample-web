FROM npm-dependencies:latest
RUN npm install -g ./ethereum-registration-service
RUN npm install -g ./ethereum-user-db-service
RUN npm install -g ./ethereum-crypto
ADD start.sh start.sh
RUN tr -d '\r' < start.sh > start2.sh
RUN rm start.sh
RUN mv start2.sh start.sh

COPY frontend frontend
RUN npm install -g bower
RUN npm install -g grunt
WORKDIR /frontend
RUN npm install 
RUN bower --allow-root install 
RUN grunt dist
WORKDIR /
COPY node-server/package.json node-server/package.json
RUN npm install ./node-server
COPY node-server node-server