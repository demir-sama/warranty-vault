# Worked examples

## 1. "Can I still return anything I bought this month?"

- Step 1 finds 21 files in `/Documents`, `/Downloads`, `/Photos/Scans`.
- Step 2 sets aside 1 duplicate Amazon invoice.
- Steps 4-6 produce 12 assets.
- Step 7 answers first with: Sony WH-1000XM5 from Best Buy, return window closes in 3 days (source: `bestbuy-order-806611254.pdf`); Philips Sonicare from Amazon.de, closes in 5 days.
- The Skill asks whether to save the register. The user says no, so nothing is written.

## 2. Serial conflict

The Costco receipt for an LG OLED55C3 lists serial `309MAPK1A123`; the photo of the TV's back label reads `309MAPK1A128`. Step 6 reports the conflict; the asset is shown as **Needs you** with both files linked. The Skill does not choose one.

## 3. Nothing found

The user names `/Music`. Step 1 returns no PDFs, photos or emails. The Skill replies: "I didn't find any receipts or invoices in /Music. Receipts are often in Documents, Downloads or a Scans folder. Want me to look there?" No register is created.

## 4. Faded receipt photo

A JB Hi-Fi receipt photo has 64% OCR confidence and its lower half is unreadable. The item, date and price are read; no warranty term is written, so the Australian default of 24 months is used and labelled *assumed*, and the asset is flagged *Needs you* with the advice to rescan.
