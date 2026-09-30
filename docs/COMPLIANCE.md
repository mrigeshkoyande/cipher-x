# Cipher-X Compliance Engine & Scoring Methodology

## 1. Transparent & Explainable Compliance Score

Unlike opaque grading systems, Cipher-X computes a fully explainable, mathematically auditable compliance score.

### Compliance Score Formula

$$\text{Compliance Score} = \left( \frac{\text{Passed} \times 1.0 + \text{Warning} \times 0.5}{\text{Total Applicable Controls}} \right) \times 100$$

### Status Definitions
- **PASS (1.0 weight)**: Configuration definitively satisfies the required security condition with positive verification evidence.
- **WARNING (0.5 weight)**: Primary condition satisfied, but auxiliary check (e.g. key strength or secondary logging precision) requires administrative attention.
- **FAIL (0.0 weight)**: Configuration directly violates security requirement or presents an active vulnerability.
- **UNKNOWN / REVIEW**: AST extractors could not match vendor syntax with high certainty. **UNKNOWN is never hidden** or silently passed; it is prominently flagged for human audit.

### Grade Thresholds
- **Grade A**: $\ge 90.0\%$
- **Grade B**: $80.0\% - 89.9\%$
- **Grade C**: $70.0\% - 79.9\%$
- **Grade D**: $60.0\% - 69.9\%$
- **Grade F**: $< 60.0\%$

---

## 2. Adding a New Vendor Pack

To add a new vendor (e.g. **Arista EOS** or **Check Point Gaia**):

1. Create `backend/app/compliance_engine/vendor_packs/arista_pack.json`.
2. Define detection regex patterns and parameter extractors:
```json
{
  "vendor": "arista",
  "display_name": "Arista Networks (EOS)",
  "platforms": ["eos"],
  "detection_patterns": ["!\\s*boot\\s+system\\s+flash:"],
  "parameter_extractors": {
    "ssh.version": {
      "patterns": ["management\\s+ssh\\s+protocol-version\\s+(?P<val>\\d+)"],
      "default": 2
    }
  },
  "remediations": {
    "REM-SSH-01": {
      "objective": "Enforce SSHv2 on Arista EOS",
      "cli_command": "configure\nmanagement ssh\n protocol-version 2\nexit",
      "verification_command": "show management ssh"
    }
  }
}
```
3. The engine automatically reloads and recognizes Arista configs without restarting the platform.
