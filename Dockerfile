FROM oven/bun

WORKDIR /app

COPY . /app

RUN bun install

COPY prisma ./prisma/

COPY . .

RUN bunx prisma generate

CMD [ "bun", "start:migrate:production" ]