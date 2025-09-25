# AI Clinical Prompt Library

*Ready-to-use prompt templates for AI-assisted clinical decision making*

## 🔍 Section 1: Medical History Pattern Analysis

### Template 1A: Symptom Correlation Analysis
```
"Please analyze this patient's medical history for potential correlations:

Patient Profile (Anonymized):
- Age: [AGE], Gender: [M/F]
- Chief complaint: [PRIMARY COMPLAINT]
- Duration: [TIMEFRAME]
- Current medications: [LIST MEDICATIONS WITH DOSES]
- Recent laboratory results: [KEY LAB VALUES]
- Vital signs: [BP, HR, TEMP as relevant]
- Associated symptoms: [LIST SYMPTOMS]

Can you identify any patterns or correlations between the symptoms, medications, and lab results that might suggest underlying connections or missed diagnoses?"
```

### Template 1B: Medication Side Effect Analysis
```
"Given this patient's medication regimen and symptoms:

Current Medications:
- [MEDICATION 1]: [DOSE, FREQUENCY, DURATION]
- [MEDICATION 2]: [DOSE, FREQUENCY, DURATION]
- [MEDICATION 3]: [DOSE, FREQUENCY, DURATION]

New or Worsening Symptoms:
- [SYMPTOM 1]: [DESCRIPTION, TIMELINE]
- [SYMPTOM 2]: [DESCRIPTION, TIMELINE]

Are there any potential medication interactions or side effects that could explain these symptoms?"
```

### Template 1C: Comorbidity Risk Assessment
```
"For a patient with these existing conditions and risk factors:

Primary Conditions:
- [CONDITION 1]: [STATUS, DURATION]
- [CONDITION 2]: [STATUS, DURATION]

Risk Factors:
- [RISK FACTOR 1]
- [RISK FACTOR 2]
- [RISK FACTOR 3]

Recent Changes:
- [NEW SYMPTOMS OR LAB CHANGES]

What additional conditions or complications should we monitor for based on these risk factors and comorbidities?"
```

---

## 📚 Section 2: Guideline Cross-Checking

### Template 2A: Treatment Plan Validation
```
"Please review this treatment plan against current clinical guidelines:

Patient: [AGE] year old [GENDER] with [PRIMARY CONDITION]
Current Treatment:
- [MEDICATION/INTERVENTION 1]
- [MEDICATION/INTERVENTION 2]
- [LIFESTYLE MODIFICATIONS]

Recent Clinical Data:
- [KEY LAB VALUES]
- [VITAL SIGNS]
- [RESPONSE TO TREATMENT]

Comorbidities: [LIST]

Based on current [SPECIFIC GUIDELINE ORGANIZATION YEAR] guidelines, are there any recommended updates or optimizations to this treatment plan?"
```

### Template 2B: Preventive Care Screening
```
"For a [AGE] year old [GENDER] with these risk factors:

Risk Factors:
- [FAMILY HISTORY]
- [PERSONAL MEDICAL HISTORY]
- [LIFESTYLE FACTORS]
- [CURRENT MEDICATIONS]

What preventive care screenings and interventions are recommended based on current USPSTF guidelines?"
```

### Template 2C: Specialty Referral Criteria
```
"Given this patient presentation:

Primary Condition: [CONDITION]
Current Management: [TREATMENTS TRIED]
Response: [TREATMENT RESPONSE]
Concerning Features: [RED FLAGS OR COMPLICATIONS]

According to current specialty society guidelines, what are the indications for referral to [SPECIFIC SPECIALTY]?"
```

---

## ⚙️ Section 3: Diagnostic Recalibration

### Template 3A: Differential Diagnosis Generation
```
"Please analyze this clinical presentation for differential diagnoses:

Patient Presentation:
- Demographics: [AGE], [GENDER]
- Chief complaint: [PRIMARY SYMPTOM]
- History of present illness: [DETAILED SYMPTOM DESCRIPTION]
- Past medical history: [RELEVANT CONDITIONS]
- Physical examination: [KEY FINDINGS]
- Laboratory results: [RELEVANT VALUES]
- Imaging: [IF AVAILABLE]

Current working diagnosis: [CURRENT DIAGNOSIS]

What are the most likely differential diagnoses to consider, and what additional testing might help differentiate between them?"
```

### Template 3B: Diagnostic Confidence Assessment
```
"Please evaluate the strength of this diagnostic assessment:

Current Diagnosis: [DIAGNOSIS]
Supporting Evidence:
- [CLINICAL EVIDENCE 1]
- [CLINICAL EVIDENCE 2]
- [LABORATORY EVIDENCE]
- [IMAGING EVIDENCE]

Inconsistent Findings:
- [FINDING 1]
- [FINDING 2]

How confident should we be in this diagnosis, and what additional information would strengthen or refute it?"
```

### Template 3C: Treatment Response Analysis
```
"Analyze this patient's response to treatment:

Original Diagnosis: [DIAGNOSIS]
Treatment Initiated: [TREATMENT PLAN]
Duration: [TIME ON TREATMENT]
Current Status:
- Symptoms: [IMPROVED/UNCHANGED/WORSE]
- Laboratory trends: [VALUES AND TRENDS]
- Functional status: [DESCRIPTION]

Given this treatment response, should we reconsider the diagnosis or modify the treatment approach?"
```

---

## 🧪 Section 4: Follow-Up and Monitoring

### Template 4A: Monitoring Protocol Development
```
"Please recommend a monitoring protocol for:

Patient: [AGE] year old [GENDER]
Primary Condition: [CONDITION]
Current Treatment: [MEDICATIONS/INTERVENTIONS]
Risk Factors: [HIGH RISK FEATURES]
Baseline Status: [CURRENT CLINICAL STATUS]

Based on current guidelines, what monitoring schedule (laboratory tests, imaging, clinical assessments) would be appropriate?"
```

### Template 4B: Complication Surveillance
```
"For a patient with [CONDITION] on [TREATMENT]:

What are the most important complications to monitor for, and what would be the appropriate surveillance strategy including:
- Warning signs patients should report
- Laboratory monitoring schedule
- Clinical assessment frequency
- When to consider specialist referral"
```

### Template 4C: Risk Stratification
```
"Please help stratify this patient's risk level:

Patient Profile:
- Age: [AGE], Gender: [GENDER]
- Primary condition: [CONDITION]
- Comorbidities: [LIST]
- Current control: [DISEASE CONTROL STATUS]
- Risk factors: [MODIFIABLE AND NON-MODIFIABLE]
- Social factors: [ADHERENCE, SUPPORT SYSTEM]

Based on validated risk scores and current guidelines, how would you classify this patient's risk level and what intensity of monitoring is recommended?"
```

---

## 🔐 Section 5: Safety and Ethical Prompts

### Template 5A: HIPAA Compliance Check
```
Before using any AI tool, verify:
- [ ] All patient identifiers removed (name, DOB, MRN, SSN, address)
- [ ] Geographic identifiers generalized (state/region only)
- [ ] Dates shifted or generalized (age instead of DOB)
- [ ] Specific institutional details removed
- [ ] Provider names anonymized
```

### Template 5B: Clinical Decision Validation
```
"After receiving AI recommendations, always ask:

1. Are these suggestions consistent with current evidence-based guidelines?
2. Do the recommendations account for this specific patient's comorbidities and contraindications?
3. What are the potential risks and benefits of following these suggestions?
4. Should I seek additional clinical input before implementing these recommendations?
5. How will I monitor for effectiveness and adverse effects?"
```

### Template 5C: Patient Communication Framework
```
When discussing AI-assisted care with patients:

"We use artificial intelligence tools to help analyze medical information and suggest treatment options. These tools help us:
- Review large amounts of medical research quickly
- Identify patterns we might miss
- Ensure we're following current best practices

However, all final medical decisions are made by your healthcare team, taking into account your specific situation, preferences, and values. The AI is a tool that supports, but never replaces, human clinical judgment."
```

---

## 💡 Quick Reference: Prompt Best Practices

### ✅ DO:
- Start with clear patient demographics (anonymized)
- Provide specific clinical data and timelines
- Include relevant comorbidities and medications
- Specify which guidelines to reference
- Ask for evidence-based reasoning

### ❌ DON'T:
- Include any patient identifiers
- Rely solely on AI recommendations
- Skip human clinical validation
- Ignore patient-specific contraindications
- Forget to document your reasoning

### 📋 Quality Checklist:
- [ ] Patient information properly anonymized
- [ ] Clinical question clearly defined
- [ ] Relevant guidelines specified
- [ ] AI response requires human validation
- [ ] Decision-making process documented

---

*Remember: These prompts are tools to enhance clinical thinking, not replace professional judgment. Always validate AI suggestions with current medical literature and seek colleague input when appropriate.*