FROM node:20-slim
MAINTAINER HMPPS Digital Studio <info@digital.justice.gov.uk>
ARG BUILD_NUMBER
ARG GIT_REF

#RUN apt-get update && apt-get install -y make python
RUN apt-get -y update && apt-get -y install curl

RUN apt-get update && apt-get install -y make python

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

# Create app directory
RUN mkdir -p /app
WORKDIR /app
ADD . .

# Install AWS RDS Root cert
RUN curl https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem > /app/root.cert
RUN curl https://s3.amazonaws.com/rds-downloads/rds-ca-2015-root.pem >> /app/root.cert

RUN npm install

#RUN npm install && \
#    npm run build && \
#    export BUILD_NUMBER=${BUILD_NUMBER} && \
#    export GIT_REF=${GIT_REF} && \
#    npm run record-build-info

ENV PORT=3000
ENV NODE_ENV='production'

ENV PASSWORD='12345'

EXPOSE 3000

RUN chown -R appuser:appgroup /app

USER 2000

CMD [ "npm", "start" ]
