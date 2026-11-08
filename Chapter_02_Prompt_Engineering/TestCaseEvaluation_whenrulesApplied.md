# Test Case Evaluation: With vs Without Anti-Hallucination Rules

## Part 1 · Did the rules give better, more accurate test cases?

**Verdict:** the rules made the test cases more honest and easier to review, but not more accurate. None of the expected results I checked were wrong in either version. The rules also had a real cost: they marked things "unknown" that a quick check of the live page could answer.

I checked four of the cases the rules flagged against app.vwo.com:

| Case | Without rules said | With rules said | Live page shows | Which version was better |
|:--|:--|:--|:--|:--|
| TC_025 Email empty | "an error message is shown" | Error text: Insufficient information to determine. | `Your email, password, IP address or location did not match` | Neither. The text was easy to capture. |
| TC_026 Password empty | same | same | same generic message | Neither, same reason |
| TC_029 Validation on blur | Message appears on blur | Same, plus message text "Insufficient" | No message appears on blur | Both expect what the PRD requires, so both would catch this. It's a real gap between the PRD and the live page, worth raising as a defect. |
| TC_046 Non-SSO email on the SSO screen | "Not redirected, error shown" | "Inference: not redirected", error text "Insufficient" | `Single Sign-On (SSO) is not enabled for your account. Enter the password to sign in.` | Both were right; the rules just added a label |

### Where the rules helped

- **Honest confidence.** 10 assumptions are now visibly labelled, for example the Secure/HttpOnly cookie flags, Enter-to-submit and single-use reset links. A reviewer knows which expected results to confirm before trusting a failure.
- **Gaps visible in the sheet.** Session timeout, lockout threshold, password rules and reset-link expiry now say "Insufficient information" in the test case itself. That's better than `<configured value>`, which looks finished but isn't.
- **Better PRD coverage.** Four PRD requirements that had no test case now have one: Dark Mode, High contrast, Microsoft login and analytics events.
- **One vague expectation made measurable.** TC_058 now uses the PRD's 95% login-success target.

### Where the rules hurt

- **They stop the model from looking things up.** Of the 16 "Insufficient" cases, at least 3 were answerable in a minute by trying the page (shown above). The rule says to answer "Insufficient" when information is missing, and nothing tells the model to check the live page first.
- **Fewer cases ready to run.** 16 of 61 can't be fully run until someone fills in a value, so the sheet looks less finished than the first one.
- **One useful test was lost.** TC_034 "Logout ends the session" was cut because the PRD doesn't mention Logout. Every logged-in app has a logout, and checking that the session really ends is a real security test. Here the strict rule removed coverage rather than an invention.

**A limit on this evaluation:** both sets are mine, and the strict one was made by applying the rules to the first set, not generated independently. The first set was also already built from the PRD and the live page. So this measures what the rules add on top of a careful baseline. Against a plain LLM run of the "without" prompt, the rules would likely win by much more, because the usual failure is invented error texts, password rules and lockout counts, which is exactly what they block.

### What I'd change in the prompt

1. Add: "Before answering *Insufficient information to determine*, check the live application. Use it only for values that cannot be observed, such as timeouts, thresholds and policies."
2. Replace "Do not invent features" with: "Features seen on the live page but missing from the PRD are kept and labelled *Observed, not in PRD*."
3. Add: "Expected results that differ between the PRD and the live page are flagged *PRD/Live mismatch*." TC_029 is the example: the PRD requires validation on blur, and the live page doesn't do it.

---

## Part 2 · Gaps found by the rules, and filling them

The anti-hallucination rules flagged **26 gaps**: 16 test cases marked "Insufficient information to determine." and 10 marked "Inference (low confidence)". They also cut 1 case for having no source (TC_034 Logout). I researched every gap and filled **12**, filled **3** partly, and **11** are still open. Most of the answers were on the live page or in VWO's public help articles all along.

### All 26 gaps and what I found

| # | Case | Missing detail | Status | What I found |
|:-:|:--|:--|:--|:--|
| 1 | TC_014 | Does Enter submit the form? | ✅ Filled | Yes, checked on the live page |
| 2 | TC_016 | How long Remember me lasts | ✅ Filled | Up to 14 days on the same browser and device |
| 3 | TC_017 | Session without Remember me | 🟡 Partial | Expires after 2 h idle; closing the browser isn't documented |
| 4 | TC_018 | Idle timeout | ✅ Filled | 2 h by default; 15 min if an admin turns that on |
| 5 | TC_019 | 2FA login flow | ✅ Filled | "2-Step Verification" screen asks for a 6-digit code from an app or email |
| 6 | TC_020 | Wrong 2FA code message | 🟡 Partial | Limit of 5 tries per 60 s found; message text not documented |
| 7 | TC_021 | Message for registered email + wrong password | ❌ Open | Needs a test account |
| 8 | TC_023 | Same message for registered and unregistered emails? | ❌ Open | Needs a test account |
| 9 | TC_025 | Message for empty email | ✅ Filled | `Your email, password, IP address or location did not match` |
| 10 | TC_026 | Message for empty password | ✅ Filled | Same message |
| 11 | TC_029 | Email check when leaving the field | ⚠️ Mismatch | PRD requires it, but the live page shows nothing |
| 12 | TC_031 | Lockout after failed logins | 🟡 Partial | No lockout documented; admin alerts and IP restriction exist |
| 13 | TC_033 | Session cookie flags | ❌ Open | Needs a logged-in session |
| 14 | TC_037 | Confirmation after a reset request | ✅ Filled | "If you are registered with us, you will receive a reset email from hello@wingify.com…" |
| 15 | TC_038 | Does the reset message reveal registered emails? | ✅ Filled | No, the wording doesn't reveal it |
| 16 | TC_041 | Message when the two new passwords differ | ❌ Open | Needs a real reset link |
| 17 | TC_042 | Password rules | ✅ Filled | 8+ characters, upper and lowercase, and a number or special character (found in the page) |
| 18 | TC_043 | How long a reset link stays valid | ❌ Open | Not documented |
| 19 | TC_046 | Message for an email without SSO | ✅ Filled | "Single Sign-On (SSO) is not enabled for your account. Enter the password to sign in." |
| 20 | TC_049 | Cancelling Google sign-in | ❌ Open | Needs a Google account |
| 21 | TC_050 | Passkey login flow | ✅ Filled | Pick the passkey in the browser prompt, then verify with fingerprint, face or PIN |
| 22 | TC_058 | Exact number of users for the load test | ❌ Open | Team must decide |
| 23 | TC_059 | Light/Dark Mode | ⚠️ Open (mismatch) | In the PRD, but not on the page or in the docs |
| 24 | TC_060 | High contrast mode | ⚠️ Open (mismatch) | In the PRD, but not on the page or in the docs |
| 25 | TC_061 | Microsoft login | ⚠️ Open (mismatch) | In the PRD, but not on the page or in the docs |
| 26 | TC_062 | Analytics event names | ❌ Open | Not public |

### Before and after

| | V1 Without rules | V2 With rules | V3 Rules + gaps filled |
|:--|:-:|:-:|:-:|
| Test cases | 58 | 61 | **73** |
| Gaps visible in the sheet | 0 (hidden) | 26 | 12 |
| Ready to run (no unknown or guessed value) | 57* | 35 | **52** |
| Confirmed on the live page | 23 | 22 | **29** |
| Backed by an official VWO help article | 0 | 0 | **15** |
| PRD vs live page mismatches found | 0 | 0 | **4** |

\* V1's number is inflated: its assumptions weren't labelled, so they look ready but aren't checked.

### What changed in V3

- **TC_034 Logout restored.** The help center documents logging out, so it's traceable again.
- **11 new test cases (TC_063–TC_073)**, all from the help center and never mentioned in the PRD:
  - 2FA backup codes, the 5-tries limit, email codes expiring after 10 minutes, and 2FA asked once per session
  - 90-day password expiry, password reuse blocking, IP allowlist and admin alerts for failed logins
  - Google sign-in needing a password set at least once, and returning to your last workspace

**Conclusion:** the rules were good at finding gaps but did nothing to fill them. The real gain came from the extra research step, which also found a likely defect: TC_029, the email field isn't validated when you leave it, though the PRD says it should be.

### Files in `output/`

- `VWO_Login_Test_Cases_GapsFilled.xlsx`: the 73 V3 test cases, a Gap Register sheet (the 26 gaps plus the 11 open questions), and a Sources sheet.
- `VWO_TestCases_Before_After_Comparison.xlsx`: Overview (the metrics and findings), the Gap Register, and Side by Side (each case's expected result in V1, V2 and V3).
