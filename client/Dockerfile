FROM node:16
WORKDIR /app
COPY . .
ENV VITE_BACKEND_URL=http://localhost:8080
RUN npm i
RUN npm run build
CMD ["npm", "run", "preview"]