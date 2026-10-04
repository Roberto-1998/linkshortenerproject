---
description: This file provides instructions for data fetching in the project.
---
# Data Fetching
Data fetching in this project should be done using the appropriate APIs and database queries. Ensure that all data fetching operations handle errors gracefully and optimize for performance where possible.

#1. Use Server Components

When fetching data for server-rendered pages, prefer using server components to fetch data directly from the database or APIs. This approach ensures better performance and reduces the amount of client-side JavaScript. Never use client components for server-side data fetching.

#2. Data fetching Methods
ALWAYS use the helper functions in the /data directory for fetching data. This ensures consistency, error handling, and performance optimizations across the project.

ALL Helper functions in the /data directory should use Drizzle ORM for database interactions. This ensures a consistent and optimized approach to querying the database throughout the project.



