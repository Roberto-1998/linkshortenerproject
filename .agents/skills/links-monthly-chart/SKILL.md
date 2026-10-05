---
name: links-monthly-chart
description: Generate a PNG bar chart of how many short links were created per month over the past 12 months, by querying the Neon Postgres database via the DATABASE_URL in the project's .env. Use whenever the user asks for link creation stats, growth/usage trends, a monthly links report, a chart or graph of links created, or analytics on the links table, even if they don't say "bar chart" or "png".
compatibility: Requires Python 3 with `psycopg[binary]` and `matplotlib` (pip install "psycopg[binary]" matplotlib).
---

# Links created per month chart

Produces a bar chart: x axis = each of the last 12 months (current month included, oldest first), y axis = number of links created in that month. Months with no links appear as 0 so the axis is always complete.

## Steps

1. Run from the project root (where `.env` lives):
   ```
   python .agents/skills/links-monthly-chart/scripts/plot_links_per_month.py --output reports/links_per_month.png
   ```
   - `--env PATH` points at a different env file; `--output PATH` sets the PNG location (default `links_per_month.png`).
   - The script reads `DATABASE_URL` from `.env` (falling back to the environment variable) and queries `links.created_at` (see `db/schema.ts`).
2. If imports fail, install dependencies: `pip install "psycopg[binary]" matplotlib`.
3. Tell the user the output path and the total link count printed by the script.

## Notes

- Never print or log the database URL; it is a secret. Don't copy `.env` anywhere.
- Read-only: the script only runs a `SELECT`.
- Months are bucketed in UTC. The reports folder is generated output; don't commit it unless asked.
