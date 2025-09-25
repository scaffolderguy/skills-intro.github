<!--
  <<< Author notes: Step 2 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
-->

## Step 2: Cross-Check with Medical Standards 📚

_You created a medical analysis branch! :tada:_

Now you'll learn how to use AI to validate treatment plans against current evidence-based guidelines. This ensures your clinical decisions align with the latest medical standards.

**What is guideline cross-checking?** It's the process of comparing current treatment plans with up-to-date clinical guidelines from organizations like ADA (American Diabetes Association), ACC/AHA (Cardiology), NICE (UK), CDC, or WHO.

**Key Benefits:**
- **Evidence-Based Care**: Ensures treatments follow current best practices
- **Quality Improvement**: Identifies outdated or suboptimal treatments
- **Risk Mitigation**: Reduces medical errors and improves outcomes
- **Continuous Learning**: Keeps practitioners updated with evolving standards

### :keyboard: Activity: Create a guideline validation template

1. On the **Code** tab in the header menu of your repository, make sure you're on your new branch `medical-history-analysis`.

2. Select the **Add file** drop-down and click **Create new file**.

3. In the **Name your file...** field, enter `GUIDELINE-TEMPLATE.md`.

4. In the **Enter file contents here** area, copy the following content:

   ```markdown
   # Clinical Guideline Validation Template

   ## Patient Information (Anonymized)
   - **Condition**: [Primary diagnosis]
   - **Current Treatment**: [Medications and dosages]
   - **Key Labs/Vitals**: [Relevant values]
   - **Comorbidities**: [Other conditions]  
   - **Guidelines Reference**: [ADA 2024, ACC/AHA, etc.]

   ## AI Prompt Template
   ```
   "Based on this treatment plan for a patient with [CONDITION]:
   - Current: [LIST CURRENT MEDICATIONS/TREATMENTS]
   - Recent labs: [KEY VALUES]
   - Comorbidities: [OTHER CONDITIONS]
   
   Are there any updates or recommendations from current [GUIDELINE ORGANIZATION YEAR] 
   guidelines that should be considered?"
   ```

   ## Expected Outcomes
   - Treatment optimization recommendations
   - Identification of newer therapeutic options
   - Risk factor management suggestions
   - Monitoring protocol updates

   ## Safety Checklist
   - [ ] Patient information anonymized
   - [ ] Current guidelines referenced
   - [ ] AI suggestions require clinical validation
   - [ ] Team review recommended for significant changes
   ```

5. Click **Commit changes...** and enter the commit message: `Add clinical guideline validation template`.

6. Click **Commit changes** to complete this step.

7. Wait about 20 seconds then refresh this page. The training will advance to Step 3.

<footer>

---

Get help: [Post in our discussion board](https://github.com/orgs/skills/discussions/categories/ai-clinical-insight) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2024 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
