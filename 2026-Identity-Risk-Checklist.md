# The 10-Minute Entra ID Risk Checklist (2026 Edition)
## Decrux Tech | Identity-First Security

In 2026, identity is the new perimeter. With the rise of AI-driven phishing and automated session hijacking, your Entra ID (formerly Azure AD) configuration is either your strongest shield or your biggest liability.

Use this checklist to audit your environment in 10 minutes.

### 1. Conditional Access: The "Zero-Day" Defense
- [ ] **Block Legacy Authentication:** Are you still allowing POP, IMAP, or SMTP? (Check: Conditional Access > Policies).
- [ ] **Require Phishing-Resistant MFA:** Are admins and high-risk users using FIDO2 or Windows Hello? (Standard TOTP is no longer enough).
- [ ] **Location-Based Blocking:** Are you blocking logins from countries where you have no employees?

### 2. Privilege Management (PIM)
- [ ] **Zero Standing Access:** Do admins have "always-on" permissions, or are they using Privileged Identity Management (PIM) for "just-in-time" access?
- [ ] **Break-Glass Accounts:** Do you have at least two cloud-only "Emergency Access" accounts that bypass MFA (stored in a physical safe)?

### 3. Non-Human Identity (NHI) Governance
- [ ] **Service Principal Audit:** When was the last time you reviewed App Registrations? (Search for "unused" or "over-privileged" service principals).
- [ ] **Secrets Expiration:** Are your app secrets set to expire, or are they permanent?

### 4. Visibility & Intelligence
- [ ] **Identity Protection:** Is "User Risk" and "Sign-in Risk" policy enabled?
- [ ] **Log Integration:** Are your Entra ID logs being exported to a SIEM (like Sentinel) for long-term retention?

---

**Need a professional deep-dive?**
Contact Decrux Tech for a comprehensive Identity & Zero-Trust Audit.
Website: [decruxtech.com](https://decruxtech.com)
Email: info@decruxtech.com
