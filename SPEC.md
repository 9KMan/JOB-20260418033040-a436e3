# SPEC.md — Brilliant Teaching: AI Instructional Planning Web App

## 1. Project Overview

**Project:** AI-Supported Instructional Planning System
**Client:** Brilliant Teaching
**Budget:** Open (hourly)
**GitHub Repo:** https://github.com/9KMan/JOB-20260418033040-a436e3

A structured 7-step guided workflow web app where teachers input instructional thinking, and AI generates contextual outputs based on those inputs — not a chatbot. All outputs remain fully editable and persist across sessions.

## 2. Job Summary

Build an MVP for an AI-powered instructional planning tool with 7-step guided workflow. Each step collects user input, stores it, and uses it (along with prior steps) to generate AI outputs in subsequent steps. Outputs are always tied to user inputs, never generic.

## 3. Technical Stack

- **Frontend:** React (Vite), React Router, CSS
- **Backend:** Node.js / Express
- **Database:** PostgreSQL (structured per-step data)
- **AI:** OpenAI API (structured prompt chaining — later steps inject prior steps as context)
- **Auth:** JWT-based authentication + session management
- **Deployment:** AWS (client ownership)
- **State:** Multi-step form state persistence across sessions

## 4. Architecture

```
client/                         # React frontend (Vite)
├── src/
│   ├── App.jsx                # Main app with router
│   ├── context/
│   │   ├── AuthContext.jsx    # JWT auth state
│   │   └── WorkflowContext.jsx # Multi-step workflow state
│   ├── pages/
│   │   ├── Login.jsx          # Auth
│   │   ├── Register.jsx       # Auth
│   │   ├── Dashboard.jsx      # Workflow list
│   │   ├── Step1.jsx          # Learning Objectives
│   │   ├── Step2.jsx          # Target Audience
│   │   ├── Step3.jsx          # Success Criteria
│   │   ├── Step4.jsx          # Instructional Strategy
│   │   ├── Step5.jsx          # Content Development
│   │   ├── Step6.jsx          # Assessment Design
│   │   ├── Step7.jsx          # Differentiation
│   │   └── Synthesis.jsx      # AI-compiled final plan
│   └── components/
│       └── Layout.jsx         # Nav + layout wrapper

server/                        # Node.js backend
├── src/
│   ├── index.js               # Express app entry
│   ├── routes/
│   │   ├── auth.js            # JWT login/register
│   │   ├── workflow.js        # CRUD for workflow steps
│   │   └── ai.js              # OpenAI structured generation
│   ├── models/
│   │   ├── User.js            # Auth users
│   │   └── Workflow.js        # Multi-step workflow data
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   └── config/
│       └── database.js        # PostgreSQL connection
```

## 5. Workflow Steps

### Step 1: Learning Objectives
- User inputs: subject, grade level, learning goals
- AI generates: suggested measurable objectives (draft editable)

### Step 2: Target Audience
- User inputs: student demographics, prior knowledge, learning styles
- AI uses: Step 1 context + Step 2 input
- AI generates: audience-adjusted content recommendations

### Step 3: Success Criteria
- User inputs: assessment benchmarks, mastery indicators
- AI uses: Steps 1-2 context
- AI generates: measurable success criteria (draft)

### Step 4: Instructional Strategy
- User inputs: teaching approach, time allocation, activities
- AI uses: Steps 1-3 context
- AI generates: structured lesson arc with timing

### Step 5: Content Development
- User inputs: topics, resources, materials
- AI uses: Steps 1-4 context
- AI generates: detailed content outline with AI-suggested additions

### Step 6: Assessment Design
- User inputs: quiz/assignment formats, rubrics
- AI uses: Steps 1-5 context
- AI generates: aligned assessment items + rubric draft

### Step 7: Differentiation
- User inputs: accommodation needs, extension options
- AI uses: Steps 1-6 context
- AI generates: differentiation plan for mixed abilities

### Synthesis Page
- Compiles all 7 steps + all AI outputs
- Full plan exportable / printable
- All entries fully editable at any time

## 6. AI Integration Pattern

**Structured Prompt Chaining** — not RAG, not chat completion:

```
System prompt: "You are an instructional design assistant. Generate outputs that are DIRECTLY based on the user's specific inputs, not generic advice."

User prompt template:
"Based on the following instructional context:
- Learning Goal: {step1_objectives}
- Target Audience: {step2_audience}
- Success Criteria: {step3_criteria}

[Step-specific question]

Respond with a structured, editable draft. Do NOT give generic advice."
```

Each step's AI call passes full accumulated context of all prior steps.

## 7. Data Model

### User
- id, email, password_hash, created_at

### Workflow
- id, user_id, title, created_at, updated_at

### WorkflowStep (per step per workflow)
- id, workflow_id, step_number (1-7), user_input (text), ai_output (text), created_at, updated_at

## 8. Authentication

- JWT tokens (access + refresh)
- Session persistence (logged-in state survives refresh)
- Per-user workflow data isolation

## 9. Key Constraints

1. **NOT a chatbot** — form-based, not chat interface
2. **NOT generic AI output** — every AI call includes structured context from prior steps
3. **All outputs editable** — user can modify any AI output
4. **Session persistence** — user can return to any step
5. **Client owns AWS deployment** — deliver working code, not hosted service

## 10. Build Verification Checklist

- [ ] All 7 step pages render and accept input
- [ ] AI generates outputs based on prior step context
- [ ] All AI outputs are editable
- [ ] Synthesis page shows full compiled plan
- [ ] Auth (register/login/logout) works
- [ ] User can save and resume workflows
- [ ] JWT tokens persist across page refresh
- [ ] Docker Compose runs full stack locally
