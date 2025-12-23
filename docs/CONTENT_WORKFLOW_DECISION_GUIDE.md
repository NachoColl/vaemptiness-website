# Content Workflow - Decision Guide

## Purpose

This document helps you evaluate whether the Google Drive sync approach is right for your needs, and what configuration options to choose.

---

## Decision 1: Should We Implement This?

### ✅ You Should Implement If:

- **Non-technical editors** need to update content regularly
- Content changes are **frequent** (multiple times per week)
- Editors are already **familiar with Google Drive**
- You want to **reduce developer bottleneck** for content updates
- Content reviews can happen **asynchronously** (15-30 min acceptable delay)
- You have **< 20 editors** working on content

### ❌ Consider Alternatives If:

- Content changes are **rare** (< once per month)
- All editors are **comfortable with Git/GitHub**
- You need **immediate updates** (< 1 minute from edit to live)
- You have **> 20 simultaneous editors** (Drive folder can get chaotic)
- Budget allows for a **proper CMS** (Sanity, Contentful, Netlify CMS)
- You need **granular permissions** (different editors for different pages)

---

## Decision 2: Sync Direction Strategy

### Option A: GitHub as Source of Truth (Recommended)

**How it works:**
- Drive changes create PRs for review
- GitHub master branch is authoritative
- Developers can update content via git

**Pros:**
- ✅ Git history preserved
- ✅ Review process built-in
- ✅ Developers have full access
- ✅ Easy rollback via git

**Cons:**
- ⏱️ Slower (requires PR approval)
- 🔧 More complex setup
- 📧 May require notifications

**Choose this if:**
- Content quality is critical
- You want developer oversight
- Team includes both devs and editors

---

### Option B: Drive as Source of Truth (Simple)

**How it works:**
- Drive changes sync directly to GitHub master
- No PR review step
- One-way sync only (Drive → GitHub)

**Pros:**
- ✅ Faster updates (15 min)
- ✅ Simpler workflow
- ✅ Less git knowledge needed

**Cons:**
- ❌ No review process
- ❌ Developers can't update via git
- ❌ Harder to track changes
- ❌ Risky for mistakes

**Choose this if:**
- Editors are highly trusted
- Content is low-risk
- Speed > safety
- Small team (< 5 people)

---

### Recommendation Matrix

| Your Situation | Recommended Strategy |
|----------------|---------------------|
| 1-3 editors, low-risk content | Option B (Drive as source) |
| 4+ editors, any content | Option A (GitHub as source) |
| Mixed technical team | Option A (GitHub as source) |
| Non-technical only | Option B (Drive as source) |
| High-value content | Option A (GitHub as source) |
| Need developer input | Option A (GitHub as source) |

**Our Recommendation for vaemptiness.es:**
**Option A (GitHub as Source of Truth)** - You have a mix of developers and editors, content is critical for the business, and the review process adds valuable quality control.

---

## Decision 3: Conflict Resolution Strategy

### Option A: Timestamp-Based Auto-Merge

**How it works:**
- Compare modification times
- Most recent change wins
- No manual intervention

**Pros:**
- ✅ Fully automated
- ✅ Fast resolution
- ✅ No human effort

**Cons:**
- ❌ Risk of data loss
- ❌ No context awareness
- ❌ Can't merge both changes

**Choose this if:**
- Conflicts are rare
- Edits are never simultaneous
- You accept occasional overwrites

---

### Option B: Manual Review (Recommended)

**How it works:**
- Conflicts create special PR
- Human reviews both versions
- Manual decision or merge

**Pros:**
- ✅ Safe, no data loss
- ✅ Context-aware decisions
- ✅ Can merge both changes

**Cons:**
- ⏱️ Requires human time
- 🔧 More complex
- 📧 Needs notifications

**Choose this if:**
- Content is valuable
- Conflicts might happen
- You have dev resources

---

### Option C: Hybrid (Our Recommendation)

**How it works:**
- Recent changes (< 5 min apart): Auto-merge, newest wins
- Older conflicts: Manual review required
- Configurable grace period

**Pros:**
- ✅ Best of both worlds
- ✅ Handles race conditions
- ✅ Safe for important conflicts

**Cons:**
- 🔧 Most complex
- ⚙️ Requires configuration

**Recommended Configuration:**
```javascript
CONFLICT_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes
AUTO_MERGE_NON_CONFLICTS = true;
REQUIRE_REVIEW_LABELS = ['content-critical'];
```

---

## Decision 4: Sync Frequency

### Every 5 Minutes
- **Pros:** Near real-time updates
- **Cons:** Higher API usage, battery drain
- **Best for:** High-frequency editing

### Every 15 Minutes (Recommended)
- **Pros:** Good balance, low API usage
- **Cons:** 15 min delay acceptable?
- **Best for:** Most use cases

### Every 30 Minutes
- **Pros:** Very low API usage
- **Cons:** Up to 30 min delay
- **Best for:** Low-frequency updates

### Manual Trigger Only
- **Pros:** Full control, zero background usage
- **Cons:** Requires manual action
- **Best for:** Scheduled updates

**Our Recommendation:** **15 minutes** - Frequent enough for most edits, low enough API usage

---

## Decision 5: Auto-Merge vs Manual Approval

### Auto-Merge Non-Conflicts

**How it works:**
- Non-conflicting Drive changes auto-merge to master
- Triggers immediate deployment
- Editors see changes live in 15-20 minutes

**Pros:**
- ✅ Fast updates
- ✅ Low friction
- ✅ Editor autonomy

**Cons:**
- ❌ No review step
- ❌ Mistakes go live immediately
- ❌ Risky for critical content

---

### Manual Approval Required (Recommended)

**How it works:**
- All Drive changes create PR
- Requires developer review
- Manual merge triggers deployment

**Pros:**
- ✅ Quality control
- ✅ Catch mistakes
- ✅ Developer oversight

**Cons:**
- ⏱️ Slower (requires review time)
- 🔧 More work for developers
- 📧 Needs notifications

---

### Hybrid Approach

**How it works:**
- Tag files as "auto-approve" or "requires-review"
- Low-risk content auto-merges
- Critical content requires review

**Example:**
```javascript
const autoApproveFiles = [
  'pages/faq.json',      // FAQ can auto-merge
  'blog/*.json'          // Blog posts can auto-merge
];

const requireReview = [
  'pages/home.json',     // Homepage requires review
  'programs/*.json'      // Programs require review
];
```

**Our Recommendation:** Start with **manual approval**, move to hybrid after observing patterns.

---

## Decision 6: Notification Strategy

### Who Gets Notified?

| Event | Editors | Developers | Both |
|-------|---------|------------|------|
| Drive edit detected | ✓ (optional) | - | - |
| Sync successful | ✓ | - | - |
| Sync failed | - | ✓ | - |
| Conflict detected | ✓ | ✓ | ✓ |
| Build failed | ✓ | ✓ | ✓ |
| Deployed to production | ✓ | - | - |

### Notification Channels

- **Email** (recommended for critical events)
- **Slack** (optional, for real-time updates)
- **GitHub notifications** (for developers)
- **Drive comments** (for editor-specific feedback)

**Our Recommendation:**
- Email for failures and conflicts
- No notifications for successful auto-syncs (reduce noise)
- Daily summary email with sync statistics

---

## Decision 7: Preview Environment

### Option A: No Preview (Simple)

**How it works:**
- Changes go directly to production after merge
- No intermediate step

**Pros:**
- ✅ Simple setup
- ✅ Faster updates

**Cons:**
- ❌ Can't preview before live
- ❌ Risky for design changes

---

### Option B: Staging Branch (Recommended)

**How it works:**
- `content-updates` branch deploys to staging URL
- Review changes before merging to master
- Master deploys to production

**Setup:**
```yaml
# Deploy content-updates to staging
if: github.ref == 'refs/heads/content-updates'
url: https://staging.vaemptiness.es

# Deploy master to production
if: github.ref == 'refs/heads/master'
url: https://vaemptiness.es
```

**Pros:**
- ✅ Preview before production
- ✅ Catch visual issues
- ✅ Safe for design changes

**Cons:**
- 🔧 Requires second deployment
- 💰 More build time

**Our Recommendation:** **Staging branch** - The safety is worth the extra complexity

---

## Decision 8: Implementation Approach

### Big Bang (Implement Everything)

**Timeline:** 6 weeks
**Pros:**
- All features at once
- Complete solution

**Cons:**
- High initial effort
- Longer time to value
- More to test

---

### Phased Rollout (Recommended)

**Phase 1 (Week 1-2):** Basic one-way sync (Drive → GitHub)
- Manual trigger only
- No conflict resolution
- Manual PR review

**Phase 2 (Week 3-4):** Automated sync
- Scheduled cron job
- Basic conflict detection
- Email notifications

**Phase 3 (Week 5-6):** Bidirectional sync
- GitHub → Drive sync
- Advanced conflict resolution
- Full monitoring

**Pros:**
- ✅ Early value
- ✅ Learn iteratively
- ✅ Lower risk

**Cons:**
- ⏱️ Longer total timeline
- 🔧 More releases

**Our Recommendation:** **Phased rollout** - Start simple, add features based on actual needs

---

## Cost-Benefit Analysis

### Costs

**Development Time:**
- Initial setup: 40-60 hours
- Testing: 20-30 hours
- Documentation: 10-15 hours
- **Total:** ~70-105 hours (2-3 weeks)

**Ongoing Costs:**
- Maintenance: ~2 hours/month
- Conflict resolution: ~1 hour/week (estimated)
- Monitoring: ~1 hour/month

**Infrastructure:**
- Google Cloud: $0 (within free tier)
- GitHub Actions: $0 (within free tier)
- Additional build time: ~$5/month (estimated)

**Total Monthly Cost:** ~$5-10 + dev time

---

### Benefits

**Time Savings:**
- Before: 10 min per content update (developer required)
- After: 0 min developer time (automated)
- Estimated: 5-10 content updates per week
- **Savings:** 50-100 min/week = 40-80 hours/year

**Editor Autonomy:**
- Editors can update content independently
- No context switching for developers
- Faster iteration on content

**Value:** Hard to quantify, but significant for small teams

---

### ROI Calculation

**Year 1:**
- Investment: 105 hours setup + 12 hours conflict resolution = 117 hours
- Savings: 60 hours (conservative estimate)
- **Net:** -57 hours (investment pays back in ~2 years)

**Year 2+:**
- Investment: 24 hours maintenance
- Savings: 60 hours
- **Net:** +36 hours/year

**Recommendation:** If content updates are frequent (> 5/week) or you expect to scale content team, ROI is positive within 2 years.

---

## Final Recommendation

### For vaemptiness.es

**Recommended Configuration:**

1. **Strategy:** GitHub as Source of Truth
2. **Conflict Resolution:** Hybrid (5-min grace + manual review)
3. **Sync Frequency:** Every 15 minutes
4. **Approval:** Manual review required initially
5. **Preview:** Staging branch deployment
6. **Notifications:** Email on failures/conflicts
7. **Implementation:** Phased rollout

**Rationale:**
- Balanced approach
- Prioritizes safety and quality
- Allows learning and iteration
- Manageable complexity

---

## Alternative: Quick Win Approach

**If you need something faster:**

1. **Use GitHub Web UI** for content editing
   - No sync needed
   - Built-in preview
   - Simple permissions
   - **Time to implement:** 0 hours (already works!)

2. **Add Netlify CMS** (if using Netlify)
   - Built for this use case
   - Beautiful UI
   - **Time to implement:** ~8-10 hours

3. **Use GitHub Codespaces** for editors
   - VS Code in browser
   - Git integration
   - **Time to implement:** ~2 hours setup

**These alternatives might be better if:**
- You need a solution NOW
- Development resources are limited
- Content update frequency is low

---

## Questions to Ask Before Starting

1. **How often will content be updated?**
   - If < 1/month → Don't build this, use GitHub UI
   - If 1-5/month → Consider simpler alternatives
   - If > 5/month → This workflow makes sense

2. **Who will edit content?**
   - If all technical → Use GitHub directly
   - If mix → This workflow works
   - If all non-technical → Consider a proper CMS

3. **What's the tolerance for errors?**
   - High (blog posts) → Auto-merge OK
   - Medium (most pages) → Manual review recommended
   - Low (homepage) → Manual review required

4. **What's your team size?**
   - 1-2 people → Might be overkill
   - 3-5 people → Sweet spot for this workflow
   - 6+ people → Consider proper CMS

5. **How much dev time can you invest?**
   - < 20 hours → Use simpler alternative
   - 20-50 hours → Build Phase 1 only
   - 50+ hours → Build full solution

---

## Next Steps

### If You Decide to Proceed

1. ✅ Review and approve architecture plan
2. 📝 Decide on configuration (use this guide)
3. 🔧 Set up Google Cloud project
4. 👨‍💻 Implement Phase 1
5. 🧪 Test with small subset of files
6. 📚 Document for editors
7. 🚀 Full rollout

### If You're Unsure

1. ✅ Try GitHub Web UI editing for 1 month
2. 📊 Track pain points and time spent
3. 📈 Measure content update frequency
4. 🤔 Revisit this decision with real data

### If You Choose Alternative

- **Netlify CMS:** Follow [official guide](https://www.netlifycms.org/docs/)
- **GitHub Codespaces:** [Setup documentation](https://docs.github.com/en/codespaces)
- **Manual editing:** Document the process for editors

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
**Status:** Decision Framework Complete
