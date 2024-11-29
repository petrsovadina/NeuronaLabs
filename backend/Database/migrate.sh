#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
until dotnet ef database test > /dev/null 2>&1; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
dotnet ef database update

# Exit with success
exit 0
