# Playful Budgeting App

Mobile-first phone screen prototype. One **primary** colour (teal), one **accent** (amber/gold), rest neutrals.

## File structure

**Homepage**
- `index.html` — Home (February Overview): watch card, spending summary, category cards (Lifestyle, Eating Out), bottom nav.

**Main pages (one HTML per page)**
- `budget.html` — Budget: Plan / Spent tabs, donut, category list, Add category, Add expense modal. Uses `budget.css` and `budget.js`.
- `goals.html` — Goals: Trip fund card, sliders, scenarios.
- `insights.html` — Insights: Week/Month, story cards (habit scale, habit pattern, reflection).

**Budget category detail pages**
- `budget-entertainment.html`
- `budget-eating-out.html`
- `budget-travel.html`
- `budget-bills.html`
- `budget-lifestyle.html`
- `budget-transport.html`
- `budget-savings.html`
- `budget-groceries.html`

**Assets**
- `assets/` — Pig icons, outfit images (`outfits/`), illustrations, coin segment.

**Budget page only (split out)**
- `budget.css` — All styles for the budget page.
- `budget.js` — Toggle, add expense, add category modal, drag-to-category, scan overlay.

Subscriptions and any unused pages have been removed.

## Run locally

Open the **homepage**:

```bash
open index.html
```

Or serve the folder (e.g. Python):

```bash
python3 -m http.server 8080
# Then open http://localhost:8080 — index.html is the homepage
```
