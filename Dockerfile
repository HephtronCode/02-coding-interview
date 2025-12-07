# ----------------------------------
# STAGE 1: Build the Frontend (React)
# ----------------------------------
FROM node:20-alpine AS frontend_builder

WORKDIR /app/client

# Copy package files
COPY client/package.json client/pnpm-lock.yaml* ./

# Install Dependencies (Use npm if pnpm missing in alpine, but lets stick to simple npm for docker safety)
RUN npm install

# Copy Source Code
COPY client/ .

# Build Vite App (Outputs to /dist)
RUN npm run build


# ----------------------------------
# STAGE 2: Build the Backend & Final Image
# ----------------------------------
# Homework Answer for Base Image: node:20-alpine
FROM node:20-alpine 

WORKDIR /app/server

# Copy Backend package files
COPY server/package.json server/pnpm-lock.yaml* ./

# Install Production Dependencies only
RUN npm install --production

# Copy Backend Source Code
COPY server/ .

# Copy Built Frontend from Stage 1 into the backend folder structure
# We place it in ../client/dist so server.js can find it
COPY --from=frontend_builder /app/client/dist ../client/dist

# Expose the API Port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start"]