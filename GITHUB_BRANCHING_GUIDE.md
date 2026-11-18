# 🌿 ShikkhaBridge — Git Branching & Team Member Separation Guide

> **For CSE470 Group Project | 4 Members × 2 Features**

This guide outlines exactly how each team member works independently on their own code without file conflicts or merge clashes.

---

## 🏛️ Architecture: How Code is Separated

Authentication is the **common platform base** (not an individual feature). Each of the 4 team members has 2 dedicated academic recovery features cleanly isolated across files:

```
shikkha-bridge/
├── client/src/modules/
│   ├── auth/                       # Shared Base (Program feature: JWT login & register)
│   ├── absence/                    # 🔴 Member 1 (F1: Logging, F2: Gaps)
│   ├── assessment/                 # 🟡 Member 2 (F3: Quizzes, F4: Evaluation)
│   ├── recovery/                   # 🔵 Member 3 (F5: Roadmaps, F6: Story Journey)
│   ├── content/                    # 🟣 Member 4 (F8: Peer Library & Collaboration)
│   ├── dashboard/
│   │   ├── student/                # 🔵 Member 3 (F6: Student Dashboard)
│   │   └── teacher/                # 🟣 Member 4 (F7: Teacher Review & Approvals)
│   └── notifications/              # Shared Alerts & Peer Bridge
│
├── server/src/
│   ├── auth/                       # Shared Base
│   ├── absence/                    # 🔴 Member 1
│   ├── assessment/                 # 🟡 Member 2
│   ├── recovery/                   # 🔵 Member 3
│   ├── content/                    # 🟣 Member 4
│   └── notifications/              # Shared Base
│
└── ai-service/app/
    ├── routers/gap_analysis.py     # 🔴 Member 1
    ├── routers/quiz_generation.py  # 🟡 Member 2
    └── routers/plan_generation.py  # 🔵 Member 3
```

---

## 👥 Member Assignments & Branch Roster

### 🔴 Member 1: Disruption Logging & Knowledge Gap Detection
- **F1: Disruption & Absence Logging Engine** (Disruption events: floods, cyclonic weather, dengue/illness, syllabus date mapping, attendance calendar)
- **F2: Knowledge Gap Detection & Loss Analytics** (Prerequisite dependency mapping, gap severity calculations, loss graph)
- **Git Branch**:
  ```bash
  git checkout develop
  git checkout -b feature/absence-gap-engine
  ```
- **Code Owned**:
  - `client/src/modules/absence/*`
  - `server/src/absence/*`
  - `ai-service/app/routers/gap_analysis.py` & `ai-service/app/services/gap_analyzer.py`

---

### 🟡 Member 2: Diagnostic AI Quizzes & Knowledge Evaluation
- **F3: AI-Powered Diagnostic Quiz Engine** (FastAPI + Gemini LLM diagnostic micro-assessments per missed topic)
- **F4: Knowledge Diagnostic Evaluation & Analytics** (Automated grading, score breakdown, weakness identification)
- **Git Branch**:
  ```bash
  git checkout develop
  git checkout -b feature/diagnostic-quizzes
  ```
- **Code Owned**:
  - `client/src/modules/assessment/*`
  - `server/src/assessment/*`
  - `ai-service/app/routers/quiz_generation.py` & `ai-service/app/utils/prompts.py`

---

### 🔵 Member 3: Personalized AI Recovery & Catch-Up Story-Map
- **F5: AI Recovery Pathway Generator** (Calibrated catch-up milestones, prerequisite sequencing, daily hours calculation)
- **F6: Whimsical Bengali-Art Learning Journey & Student Hub** (Stepping stone story-map with Nakshi Kantha borders, streak tracking, milestone completion)
- **Git Branch**:
  ```bash
  git checkout develop
  git checkout -b feature/recovery-pathways
  ```
- **Code Owned**:
  - `client/src/modules/recovery/*`
  - `client/src/modules/dashboard/student/*`
  - `server/src/recovery/*`
  - `ai-service/app/routers/plan_generation.py` & `ai-service/app/services/plan_builder.py`

---

### 🟣 Member 4: Teacher Orchestration & Peer Catch-Up Bridge
- **F7: Teacher Review & Plan Approval Workflow** (Classroom disruption metrics, plan customization/override, teacher notes, approval/rejection)
- **F8: Content Library & Peer Collaboration Bridge** (Peer handwritten notes & explainer video sharing, teacher study aids, contextual recovery notes)
- **Git Branch**:
  ```bash
  git checkout develop
  git checkout -b feature/teacher-collaboration
  ```
- **Code Owned**:
  - `client/src/modules/dashboard/teacher/*`
  - `client/src/modules/content/*`
  - `server/src/content/*`
  - `server/src/notifications/*`

---

## 🚀 How to Push to GitHub (Step-by-Step)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name it `shikkha-bridge`.
3. Set visibility to **Public** or **Private**.
4. Leave "Add README" **unchecked** (we already created a rich one).

### Step 2: Link Local Repo to GitHub & Push Base Branches
Run these in PowerShell at `C:\Users\ASUS\.gemini\antigravity\scratch\shikkha-bridge`:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/shikkha-bridge.git
git push -u origin main
git push -u origin develop
```

### Step 3: Working on Feature Branches
Whenever a member begins coding:
```bash
# Example for Member 1:
git checkout develop
git checkout -b feature/absence-gap-engine

# Make changes to your module files...
git add .
git commit -m "feat(absence): implement disruption calendar and gap severity model"
git push -u origin feature/absence-gap-engine
```

### Step 4: Making a Pull Request (PR) on GitHub
1. Open the repository on GitHub.
2. Click **"Compare & pull request"**.
3. Set base branch to **`develop`** (never merge directly into `main` during feature development!).
4. Add teammates as reviewers and merge once approved.
