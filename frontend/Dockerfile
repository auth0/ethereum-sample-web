#Build: docker build -t auth0-login-web/nginx .
#Run: docker run -p 80:80 --name auth0-login-web -d auth0-login-web/nginx
FROM nginx
COPY dist/web /usr/share/nginx/html