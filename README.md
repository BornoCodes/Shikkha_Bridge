# 🌉 Shikkha_Bridge

### Bridging Knowledge, Empowering Learning.

**Shikkha_Bridge** is an AI-powered educational platform designed to make learning more interactive, accessible, and engaging. The platform combines AI-driven learning assistance, interactive assessments, gamification, and collaborative educational resources to create a more personalized learning experience for students.

Our goal is to go beyond traditional video-based learning by transforming educational content into an interactive journey where students can learn, practice, evaluate their understanding, and track their progress.

## 🚀 Key Features

- **AI-Powered Video Summarization:** Automatically generates concise notes and summaries from educational video sessions.
- **AI-Generated Assignments:** Creates assignments automatically upon completion of a full learning session.
- **Interactive Timed Quizzes:** Generates short quizzes after video segments to evaluate students' understanding.
- **Progressive Video Unlocking:** Students must complete quizzes before accessing the next segment of a video, encouraging active learning.
- **Note Bidding System:** Allows students to sell and purchase educational notes through a bidding system. Bidding begins when requests for particular notes reach a predefined threshold.
- **Gamified Learning Dashboard:** Tracks student progress through a visual reward system featuring stars and a Forest Growth concept, motivating students to maintain consistent learning habits.
and many more upcoming features.

## 🌱 Our Vision

We aim to create an educational ecosystem where technology makes learning more engaging, collaborative, and personalized. By integrating artificial intelligence with gamification and peer-to-peer knowledge sharing, Shikkha_Bridge seeks to encourage students to become active participants in their own learning journeys.

## 👥 Development Team

Developed collaboratively by a team of 4 members as an academic software development project.

More features and improvements are planned as development progresses.



## 🏛️ Architecture: How Code is Separated


Each of the 4 team members has 2 dedicated academic recovery features cleanly isolated across files:

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

