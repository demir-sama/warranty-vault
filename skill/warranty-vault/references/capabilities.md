# Capabilities used

Every step maps to a CLI and Action in the public capability catalog (uliya-skill-kit 0.7.3). The parent Skill only delegates; each expert selects and runs its own Actions.

| Step | Expert | CLI | Action(s) | Effect | Approval |
|---|---|---|---|---|---|
| 1 Find candidate files | file-agent | ug-filesystem | find, md5sum | read | none |
| 3 Read text from photos | photo-agent | ug-photo | vision-ocr | read | none |
| 4 Classify documents | document-agent | ug-document | metadata | read | none |
| 5 Extract purchase facts | document-agent | ug-document | extract | read | none |
| 6 Reconcile into assets | document-agent | ug-document | reconcile | read | none |
| 8 Save the register | knowledge-agent | ug-knowledge | save-text | state-change | workflow (user confirms first) |
| 9 Tag source files | file-agent | ug-filemgr | tag-get-by-name, tag-add, tag-add-file | state-change | gateway / conditional (user confirms first) |

Steps 2 and 7 are computed by the Skill from results already returned (checksums and extracted dates); they call no capability.

Not used, by design: delete, move, rename, share, or any capability that sends data off the NAS.
