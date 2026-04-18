# AI Instructional Planning Web App

An AI-powered web application for creating comprehensive instructional plans through a 7-step guided workflow.

## Features

- **7-Step Guided Workflow**: Structured approach to instructional planning
- **AI-Assisted Content Generation**: GPT-powered suggestions for content outline, activities, and assessments
- **Editable Outputs**: All AI-generated content can be edited
- **User Authentication**: Secure JWT-based authentication
- **Persistent State**: Workflow progress saved to database
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (MVP) / PostgreSQL (production-ready)
- **AI**: OpenAI GPT-4
- **Auth**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/9KMan/JOB-20260418033040-a436e3.git
cd JOB-20260418033040-a436e3
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key and JWT secret
```

4. Initialize the database:
```bash
cd server && npm run db:init
```

5. Start the development servers:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## The 7-Step Workflow

1. **Learning Goal**: Define the learning objective
2. **Target Audience**: Identify who the learners are
3. **Success Criteria**: Establish what success looks like
4. **Content Outline**: Generate content structure (AI-assisted)
5. **Activities**: Generate learning activities (AI-assisted)
6. **Assessment**: Create assessment methods (AI-assisted)
7. **Synthesis**: Review and edit all components

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Workflow
- `GET /api/workflow` - Get all workflows for user
- `POST /api/workflow` - Create new workflow
- `GET /api/workflow/:id` - Get workflow by ID
- `PUT /api/workflow/:id` - Update workflow
- `DELETE /api/workflow/:id` - Delete workflow

### Steps
- `GET /api/workflow/:workflowId/steps` - Get all steps
- `PUT /api/workflow/:workflowId/steps/:stepNumber` - Update step
- `GET /api/workflow/:workflowId/steps/:stepNumber` - Get specific step

### AI Generation
- `POST /api/ai/content-outline` - Generate content outline
- `POST /api/ai/activities` - Generate activities
- `POST /api/ai/assessment` - Generate assessment

## License

MIT
