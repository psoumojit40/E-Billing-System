FROM php:8.2-apache

# Install system dependencies and PHP extensions required by Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_mysql zip

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js & npm (Required to build the React frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Copy the entire project into the container
COPY . /var/www/html/

# Update Apache DocumentRoot to point to Laravel's public directory
RUN sed -i 's!/var/www/html!/var/www/html/backend/public!g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's!/var/www/!/var/www/html/backend/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# --- BUILD FRONTEND ---
# Install NPM dependencies and build the React app into backend/public
RUN npm install
RUN npm run build

# --- BUILD BACKEND ---
# Install Composer dependencies for Laravel
WORKDIR /var/www/html/backend
RUN composer install --no-dev --optimize-autoloader

# Set correct permissions for Laravel's cache and storage folders
RUN chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache

# Apache will automatically start and serve the app on port 80
EXPOSE 80
