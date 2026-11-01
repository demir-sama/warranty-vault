# Saved register format

The file saved in step 8 is Markdown so it opens in any editor on the NAS.

```
# Household asset register

Generated 2026-11-01 by Warranty Vault. Every date comes from the listed source files; "assumed" terms are regional defaults.

| Item | Model | Serial | Retailer | Purchased | Return by | Warranty until | Status |
|---|---|---|---|---|---|---|---|
| Wireless noise-cancelling headphones | Sony WH-1000XM5 | S01-5521873 | Best Buy | 2026-10-20 | 2026-11-04 | 2027-10-20 (receipt) | Return window closes in 3d |

## Needs you
- LG OLED55C3: serial on the receipt (309MAPK1A123) doesn't match the label photo (309MAPK1A128).

## Sources
- Wireless noise-cancelling headphones: /Documents/Receipts/2026/bestbuy-order-806611254.pdf

## Skipped
- /Downloads/boarding-pass-LHR-JFK.pdf: travel document, not a product
```

The file name is `Warranty Register YYYY-MM-DD.md`. An existing file is never overwritten.
