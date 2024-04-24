# Verwende ein Node.js-Base-Image
FROM node:18

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /app

# Kopiere die package.json-Datei und installiere die Abhängigkeiten
COPY package.json .
COPY package-lock.json .
RUN npm install

# Kopiere den restlichen Code in den Container
COPY . .

# Öffne den Port 3000, auf dem die Anwendung läuft
EXPOSE 3000

# Starte die Anwendung
CMD ["node", "index.js"]
