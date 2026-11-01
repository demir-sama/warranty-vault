---
name: warranty-vault
description: Builds a household asset register from receipts, invoices, order emails, product manuals and serial-label photos already stored on the NAS. Reports every item with its serial number, purchase date, price, return deadline and warranty end date, each traced to a source file, and lists items whose return window or warranty is about to close. Use when the user asks what they own, what is still under warranty, when they can still return something, or wants a warranty register saved to the NAS. Read-only until the user approves saving the register and tagging the source files.
---

# Goal

Give the user one trustworthy list of the durable things they own, built only from documents that already exist on their NAS, with two kinds of alert:

- **Return window closing**: purchases whose stated return period ends within 7 days.
- **Warranty ending**: items whose warranty ends within 45 days, plus items whose warranty has already ended.

Every date, price and serial number in the result must come from a named file on the NAS. When a term is not written in any document, the register says it is a regional assumption, never a fact. The Skill does not contact retailers, file claims, or send anything outside the NAS.

Scope: receipts and invoices (PDF), receipt photos and serial-label photos (JPG, PNG, HEIC), product manuals (PDF), and exported order emails (EML) in the folders the user names. Groceries, restaurant bills, travel documents and bank statements are out of scope and are reported as skipped.

# Required input

- **Folders to search**: one or more NAS folders, for example `/Documents/Receipts`, `/Downloads`, `/Photos/Scans`. If the user gives none, ask once and offer their personal home folder as the default. Do not search shared folders the user did not name.
- **Today's date**: taken from the conversation context; used only to compute days remaining.
- **Save location** (only if the user wants the register saved): a folder path. Default proposal: `/Warranty Vault/` inside the user's home folder.

Do not ask for account credentials, retailer logins or payment details. They are never needed.

# Generation-time capability evidence

- `ug-filesystem` → `file-agent`
- `ug-filemgr` → `file-agent`
- `ug-photo` → `photo-agent`
- `ug-document` → `document-agent`
- `ug-knowledge` → `knowledge-agent`

Details of each Action used, its effect and approval level are in [references/capabilities.md](references/capabilities.md).

# Orchestration

Run the steps in order. Each downstream step receives only the real result returned by the upstream expert; when that result is missing, the dependent step does not run.

1. **Find candidate files**
   `delegate --target file-agent --instruction 'Search only the folders the user named in this conversation, and nothing else. Find files of type pdf, jpg, jpeg, png, heic and eml, up to 2,000 files. Return each real path, size, modification time and md5 checksum. Do not open, move, rename or delete anything.'`
   Pass on: the list of real paths and checksums. If the list is empty, stop and go to *Empty result*.

2. **Set aside duplicate copies**
   Group the paths from step 1 by identical md5 checksum. Keep the first path in each group and remember the others as duplicates. No delegation is needed; this uses the checksums already returned.

3. **Read text from photos**
   `delegate --target photo-agent --instruction 'Run OCR on each image path in the list attached to this request (the image files kept after duplicate removal). Return the recognised text and a confidence value for each path. Do not create albums or change any photo.'`
   Pass on: text per image. Images whose OCR confidence is below 30% are marked *unreadable* and reported to the user, not guessed.

4. **Classify documents**
   `delegate --target document-agent --instruction 'For each PDF and EML path in the attached list (the documents kept after duplicate removal), read the metadata and first page and classify the file as one of: purchase receipt or invoice, product manual, other. Return the class and a one-line reason for each path.'`
   Images are classified from their step 3 text: a receipt has an order or invoice number and a total; a serial label has a serial number (S/N) and a model number. Everything else is *skipped* with its reason.

5. **Extract purchase facts**
   `delegate --target document-agent --instruction 'From each receipt and order email in the attached list of paths classified as receipts, extract: retailer, order number, purchase date (YYYY-MM-DD), country of sale, brand, model, product name, serial number, total paid with currency, warranty term in months, and return period in days. For every field return the exact line of text it came from. Return null for any field that is not written in the document; do not infer warranty or return terms.'`
   For receipt photos, use the step 3 OCR text instead of a new delegation and apply the same field rules. Field schema and rules are in [references/register-fields.md](references/register-fields.md).

6. **Reconcile into assets**
   `delegate --target document-agent --instruction 'Reconcile the attached extracted receipt facts against the attached manual paths and serial-label OCR texts. Match by model number. For each receipt return: the matching manual path and the warranty term it states, the matching label path and the serial number it shows, and any conflict between the receipt and the label or manual.'`
   Warranty term priority: receipt, then manual, then a regional default marked *assumed* (see [references/register-fields.md](references/register-fields.md)). A serial-number conflict marks the asset **Needs you** and is never resolved automatically.

7. **Compute alerts and present the register**
   For each asset compute the return deadline (purchase date + return days) and warranty end (purchase date + warranty months), then the days left from today's date. Show the user, in this order: items with a return window closing within 7 days, items needing review, warranties ending within 45 days, ended warranties, then everything covered. Each row lists its source files. Also list skipped files with reasons and the duplicates set aside.

8. **Save the register (only after approval)**
   Ask: *"Save this register as `Warranty Register <date>.md` in `<save folder>`?"* Only if the user says yes:
   `delegate --target knowledge-agent --instruction 'Save the attached register Markdown as a new file named Warranty Register followed by the current date in YYYY-MM-DD form and the .md extension, in the save folder the user approved. Do not overwrite an existing file; if the name exists, add a numeric suffix. Return the verified output path.'`
   Report the saved path only when the expert returns a verified output file.

9. **Tag the source files (only after approval)**
   Ask: *"Tag the <n> source files with the tag `warranty-vault` so you can find them later?"* Only if the user says yes:
   `delegate --target file-agent --instruction 'Find the tag named warranty-vault; create it if it does not exist. Then add that tag to each source file path in the attached list. Do not move, rename or delete any file. Return the files that were tagged and any that failed.'`

The layout of the saved register is in [references/report-format.md](references/report-format.md).

# Completion and failure

- **completed**: report only what the expert returned. For step 8, report the saved file path and size; for step 9, report how many files were tagged and list any that failed.
- **failed**: say which step failed and what was already finished. If step 1 or step 5 fails, stop: no register is produced. If step 3 fails, continue with PDF and email documents only and tell the user photos were not read. If step 6 fails, present assets from receipts alone and say manuals and labels were not checked.
- **cancelled**: stop and report what was found so far without saving or tagging anything.
- **waiting_user**: ask the expert's question in plain words, for example which folder to search, then resume the same step with the answer.
- **waiting_approval**: show the user exactly what will be written or tagged and wait. Never treat silence as approval.
- **Empty result**: if step 1 finds no files, or step 4 finds no receipts, say "I didn't find any receipts or invoices in <folders>." and suggest folders where receipts are usually kept. Do not create an empty register.
- **Partial result**: if some receipts could not be read or lack a purchase date, list them under *Could not read* with the reason. Never fill a missing date, price or serial number from another document unless the reconcile step matched it by model number.

Third-party disclosure and AI tool use are in [references/disclosure.md](references/disclosure.md). Worked examples are in [references/examples.md](references/examples.md). A plain-language overview for users is in [references/overview.md](references/overview.md).
