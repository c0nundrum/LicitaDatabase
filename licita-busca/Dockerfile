# Use the official Node.js image.
# Check https://hub.docker.com/_/node to select the version.
FROM node:22-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./
# If you are using yarn, you can replace the above line with:
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# If you are using yarn, you can replace the above line with:
# RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

EXPOSE 3000

CMD npm run build

# Build the Next.js application
#RUN npm run build
# If you are using yarn, you can replace the above line with:
# RUN yarn build

# The command to run your app (port 3000 is the default for Next.js)
#CMD ["npm", "start"]
# If you are using yarn, you can replace the above command with:
# CMD ["yarn", "start"]
