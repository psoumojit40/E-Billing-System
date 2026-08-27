FROM php:8.2-cli-alpine

# Install PDO MySQL extensions
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /app
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-5000} index.php"]
