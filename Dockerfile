FROM node:25-slim
WORKDIR /usr/src/dragoteryx.xyz
COPY . .

RUN apt-get update && apt-get install -y curl build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add wasm32-unknown-unknown

RUN npm install -g pnpm
RUN CI=true pnpm install
RUN pnpm build-wasm
RUN pnpm build

EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]