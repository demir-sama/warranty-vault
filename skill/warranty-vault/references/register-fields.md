# Register fields and rules

## Fields extracted per receipt

| Field | Rule |
|---|---|
| retailer | First line or letterhead of the document. |
| order | Order, invoice or receipt number as written. |
| purchase date | ISO date `YYYY-MM-DD`. If only a dispatch date exists, use it and say so. |
| country | Country of sale as written, or the retailer's address country. |
| brand, model, product | As written on the line item. Model numbers are kept exactly, including dashes. |
| serial | From the receipt, else from a matched serial-label photo. |
| total | Amount and currency as written. Currencies are never converted. |
| warranty months | Only if written ("2 year guarantee" = 24, "10 års garanti" = 120). |
| return days | Only if written ("Returns within 15 days" = 15). |

Every field carries the exact line it came from. A field with no supporting line is left empty.

## Warranty term priority

1. A term written on the receipt or order email.
2. A term written in a manual matched by model number.
3. A regional default, always shown as **assumed** with the reason:

| Country of sale | Default | Basis |
|---|---|---|
| EU member states | 24 months | EU 2-year legal guarantee of conformity |
| United Kingdom | 12 months | Typical manufacturer warranty |
| United States, Canada, Japan | 12 months | Typical manufacturer warranty |
| Australia | 24 months | Consumer-law guidance for major appliances |
| Anywhere else | 12 months | Common manufacturer default |

Assumed terms are flagged *Needs you* so the user can confirm them from the warranty card.

## Alert rules

- **Return window closing**: 0 to 7 days left on a written return period.
- **Warranty ending**: 0 to 45 days left.
- **Warranty ended**: negative days left. Shown so the user knows not to pay for repairs they think are covered.
- **Needs you**: serial conflict between documents, assumed warranty term, or a partly unreadable receipt.
