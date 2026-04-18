import express from 'express';
import OpenAI from 'openai';
import { authMiddleware } from '../middleware/auth.js';
import { Workflow } from '../models/Workflow.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Lazy initialize OpenAI client
let openaiClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

// Helper to get all previous steps as context
async function getContext(workflowId) {
  const steps = await Workflow.getAllSteps(workflowId);
  const context = {};
  steps.forEach(step => {
    switch (step.step_number) {
      case 1:
        context.learningGoal = step.data.content || '';
        break;
      case 2:
        context.targetAudience = step.data.content || '';
        break;
      case 3:
        context.successCriteria = step.data.content || '';
        break;
      case 4:
        context.contentOutline = step.data.content || '';
        break;
      case 5:
        context.activities = step.data.content || '';
        break;
      case 6:
        context.assessment = step.data.content || '';
        break;
    }
  });
  return context;
}

// Step 4: Generate Content Outline
router.post('/content-outline', async (req, res) => {
  try {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow || workflow.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const context = await getContext(workflowId);

    if (!context.learningGoal) {
      return res.status(400).json({ error: 'Step 1 (Learning Goal) is required' });
    }
    if (!context.targetAudience) {
      return res.status(400).json({ error: 'Step 2 (Target Audience) is required' });
    }
    if (!context.successCriteria) {
      return res.status(400).json({ error: 'Step 3 (Success Criteria) is required' });
    }

    const prompt = `You are an expert instructional designer helping create a comprehensive course outline.

Based on the following information, generate a detailed content outline:

**Learning Goal:** ${context.learningGoal}

**Target Audience:** ${context.targetAudience}

**Success Criteria:** ${context.successCriteria}

Please generate a structured content outline that includes:
1. Main modules/topics (3-6 major sections)
2. Sub-topics under each module
3. Key learning points for each sub-topic
4. Suggested time allocation for each module

Format the output as a well-organized markdown structure with clear headings and bullet points.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert instructional designer with years of experience creating comprehensive learning materials.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content;

    // Save the generated content to step 4
    const step = await Workflow.updateStep(workflowId, {
      step_number: 4,
      data: { content },
      ai_generated: true
    });

    res.json({ content, step });
  } catch (error) {
    console.error('Error generating content outline:', error);
    res.status(500).json({ error: 'Failed to generate content outline', details: error.message });
  }
});

// Step 5: Generate Activities
router.post('/activities', async (req, res) => {
  try {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow || workflow.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const context = await getContext(workflowId);

    if (!context.learningGoal) {
      return res.status(400).json({ error: 'Step 1 (Learning Goal) is required' });
    }
    if (!context.targetAudience) {
      return res.status(400).json({ error: 'Step 2 (Target Audience) is required' });
    }
    if (!context.successCriteria) {
      return res.status(400).json({ error: 'Step 3 (Success Criteria) is required' });
    }
    if (!context.contentOutline) {
      return res.status(400).json({ error: 'Step 4 (Content Outline) is required' });
    }

    const prompt = `You are an expert instructional designer helping create engaging learning activities.

Based on the following information, generate appropriate learning activities:

**Learning Goal:** ${context.learningGoal}

**Target Audience:** ${context.targetAudience}

**Success Criteria:** ${context.successCriteria}

**Content Outline:**
${context.contentOutline}

Please generate a variety of learning activities that:
1. Align with the learning objectives
2. Are appropriate for the target audience
3. Help learners achieve the success criteria
4. Include different activity types (individual work, group work, hands-on practice, discussions, etc.)

For each activity include:
- Activity name
- Type (individual/group/pair)
- Duration
- Materials needed
- Step-by-step instructions
- How it connects to the learning objectives

Format the output as a well-organized markdown structure.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert instructional designer specializing in active learning and engagement strategies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    const content = completion.choices[0].message.content;

    // Save the generated content to step 5
    const step = await Workflow.updateStep(workflowId, {
      step_number: 5,
      data: { content },
      ai_generated: true
    });

    res.json({ content, step });
  } catch (error) {
    console.error('Error generating activities:', error);
    res.status(500).json({ error: 'Failed to generate activities', details: error.message });
  }
});

// Step 6: Generate Assessment
router.post('/assessment', async (req, res) => {
  try {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow || workflow.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const context = await getContext(workflowId);

    if (!context.learningGoal) {
      return res.status(400).json({ error: 'Step 1 (Learning Goal) is required' });
    }
    if (!context.targetAudience) {
      return res.status(400).json({ error: 'Step 2 (Target Audience) is required' });
    }
    if (!context.successCriteria) {
      return res.status(400).json({ error: 'Step 3 (Success Criteria) is required' });
    }
    if (!context.contentOutline) {
      return res.status(400).json({ error: 'Step 4 (Content Outline) is required' });
    }
    if (!context.activities) {
      return res.status(400).json({ error: 'Step 5 (Activities) is required' });
    }

    const prompt = `You are an expert instructional designer specializing in assessment design.

Based on the following information, generate comprehensive assessment methods:

**Learning Goal:** ${context.learningGoal}

**Target Audience:** ${context.targetAudience}

**Success Criteria:** ${context.successCriteria}

**Content Outline:**
${context.contentOutline}

**Learning Activities:**
${context.activities}

Please generate assessment methods that:
1. Effectively measure whether learners have achieved the success criteria
2. Are appropriate for the target audience
3. Include both formative (ongoing) and summative (final) assessments
4. Use varied assessment formats

For each assessment include:
- Assessment name
- Type (formative/summative)
- Purpose
- Format/structure
- Grading criteria or rubric
- Timing (when to administer)

Format the output as a well-organized markdown structure.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in educational assessment and measurement, familiar with various assessment frameworks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    const content = completion.choices[0].message.content;

    // Save the generated content to step 6
    const step = await Workflow.updateStep(workflowId, {
      step_number: 6,
      data: { content },
      ai_generated: true
    });

    res.json({ content, step });
  } catch (error) {
    console.error('Error generating assessment:', error);
    res.status(500).json({ error: 'Failed to generate assessment', details: error.message });
  }
});

export default router;
