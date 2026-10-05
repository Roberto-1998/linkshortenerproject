"""Plot links created per month over the past 12 months as a PNG bar chart.

Reads DATABASE_URL from the project's .env file (or the environment), queries
the `links` table, and writes a bar chart image.

Usage: python plot_links_per_month.py [--env PATH] [--output PATH]
"""
import argparse
import os
import sys
from datetime import date
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import psycopg


def load_database_url(env_path: Path) -> str:
    if env_path.is_file():
        for raw in env_path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            if key.strip() == "DATABASE_URL":
                return value.strip().strip('"').strip("'")
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit(f"DATABASE_URL not found in {env_path} or environment")
    return url


def last_12_months(today: date) -> list[date]:
    """First day of each of the last 12 months, oldest first (current month last)."""
    months = []
    y, m = today.year, today.month
    for _ in range(12):
        months.append(date(y, m, 1))
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    return months[::-1]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", default=".env", help="path to .env (default: ./.env)")
    parser.add_argument("--output", default="links_per_month.png")
    args = parser.parse_args()

    months = last_12_months(date.today())
    start = months[0]

    with psycopg.connect(load_database_url(Path(args.env))) as conn:
        rows = conn.execute(
            """
            SELECT date_trunc('month', created_at AT TIME ZONE 'UTC')::date AS month,
                   count(*)
            FROM links
            WHERE created_at >= %s
            GROUP BY 1
            """,
            (start,),
        ).fetchall()

    counts = {row[0]: row[1] for row in rows}
    values = [counts.get(m, 0) for m in months]  # months with no links show as 0
    labels = [m.strftime("%b %Y") for m in months]

    fig, ax = plt.subplots(figsize=(11, 6))
    bars = ax.bar(labels, values, color="#4f46e5")
    ax.bar_label(bars, padding=3)
    ax.set_xlabel("Month")
    ax.set_ylabel("Links created")
    ax.set_title("Links created per month (past 12 months)")
    ax.yaxis.get_major_locator().set_params(integer=True)
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right")
    fig.tight_layout()

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=150)
    print(f"Saved {out.resolve()} (total links: {sum(values)})")


if __name__ == "__main__":
    main()
