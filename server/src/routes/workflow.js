import express from 'express';
import { Workflow } from '../models/Workflow.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all workflows for user
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.findByUserId(req.user.id);
    res.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Create new workflow
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const workflow = await Workflow.create(req.user.id, title || 'Untitled Plan');
    res.status(201).json({ workflow });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Get workflow by ID
router.get('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const steps = await Workflow.getAllSteps(workflow.id);
    res.json({ workflow, steps });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// Update workflow
router.put('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Workflow.update(req.params.id, req.body);
    res.json({ workflow: updated });
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// Delete workflow
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Workflow.delete(req.params.id);
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

// Get all steps for workflow
router.get('/:id/steps', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const steps = await Workflow.getAllSteps(workflow.id);
    res.json({ steps });
  } catch (error) {
    console.error('Error fetching steps:', error);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

// Update specific step
router.put('/:id/steps/:stepNumber', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stepNumber = parseInt(req.params.stepNumber);
    if (stepNumber < 1 || stepNumber > 7) {
      return res.status(400).json({ error: 'Step number must be between 1 and 7' });
    }

    const step = await Workflow.updateStep(workflow.id, {
      step_number: stepNumber,
      data: req.body.data,
      ai_generated: req.body.ai_generated || false
    });

    res.json({ step });
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// Get specific step
router.get('/:id/steps/:stepNumber', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    if (workflow.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stepNumber = parseInt(req.params.stepNumber);
    const step = await Workflow.getStep(workflow.id, stepNumber);

    if (!step) {
      return res.json({ step: null });
    }

    res.json({ step });
  } catch (error) {
    console.error('Error fetching step:', error);
    res.status(500).json({ error: 'Failed to fetch step' });
  }
});

export default router;
