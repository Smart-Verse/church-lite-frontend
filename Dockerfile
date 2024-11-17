
FROM node:20 as build


ARG REPO_URL=https://github.com/Church-Lite/church-lite-frontend.git
ARG GIT_TOKEN


WORKDIR /app


RUN apt-get update && apt-get install -y git


RUN git clone https://${GIT_TOKEN}:x-oauth-basic@github.com/Church-Lite/church-lite-frontend.git .


RUN npm install


RUN npm run build


FROM nginx:alpine


COPY --from=build /app/dist/church-lite-frontend/browser /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
