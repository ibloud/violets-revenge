// Violet's Revenge: The Forensics Trail
// Interactive sample based on the current Story Bible.
// Non-canon: this example demonstrates tone and evidence-minded choices only.
// Canon constraints: the attack is never shown; the Guilty remain anonymized;
// the story follows the three-act structure.

VAR examined_record = false
VAR examined_witness = false
VAR examined_lab = false

-> opening

=== opening ===
London. The forensic archive is quiet except for the ventilation and the soft click of a desk lamp.

Violet has been asked to review a file whose summary speaks with more certainty than its supporting pages. The task is not to decide what must have happened. It is to establish what the record can actually support.

This is a short, non-canon interactive example. Your choices shape the order of review, not the established story.

+ [Begin the examination.] -> trail

=== trail ===
The file is open. Three sources remain to be reviewed. Keep observation separate from interpretation; an unresolved point is not a failure.

{not examined_record:
    + [Inspect the intake record.] -> intake_record
}
{not examined_witness:
    + [Read the witness account.] -> witness_account
}
{not examined_lab:
    + [Review the laboratory note.] -> lab_note
}
+ [Close the file and write a cautious finding.] -> finding

=== intake_record ===
~ examined_record = true
The intake record establishes when the file entered the system and who logged it. It does not, by itself, establish the truth of every statement copied into the summary.

Violet marks the date and source. She leaves the conclusion field blank.

-> trail

=== witness_account ===
~ examined_witness = true
The witness account contains a clear memory, a gap in the timeline, and one detail the witness says they inferred rather than saw.

Violet preserves the account in its own words. A sincere witness can still be mistaken; uncertainty is not an accusation.

-> trail

=== lab_note ===
~ examined_lab = true
The laboratory note records a result and the limits of the method used. It supports one narrow observation, not the broader story someone has written around it.

Violet records the result, the method, and what the test cannot tell her.

-> trail

=== finding ===
The file is not yet a verdict.

Violet separates what was directly recorded, what someone reported, what can reasonably be inferred, and what remains unresolved. She does not promote a gap into a fact just because the explanation would be convenient.

{examined_record and examined_witness and examined_lab:
    All three sources have been reviewed. The record is clearer, but clarity is not the same as certainty.
| else:
    Some sources remain unread. Violet notes that limitation instead of pretending the review is complete.
}

This is the Examiner: patient, precise, and willing to leave a question open. The attack is not depicted here. The later acts remain part of the larger story structure, not this sample scene.

+ [Return to the file.] -> trail
+ [Restart the experience.] -> opening

-> END
