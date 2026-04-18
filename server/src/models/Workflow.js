import { Database } from '../config/database.js';

export const Workflow = {
  async create(userId, title = 'Untitled Plan') {
    const result = await Database.run(
      'INSERT INTO workflows (user_id, title) VALUES (?, ?)',
      [userId, title]
    );
    return { id: result.lastInsertRowid, user_id: userId, title, current_step: 1 };
  },

  async findByUserId(userId) {
    return Database.all('SELECT * FROM workflows WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
  },

  async findById(id) {
    return Database.get('SELECT * FROM workflows WHERE id = ?', [id]);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.current_step !== undefined) {
      fields.push('current_step = ?');
      values.push(data.current_step);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await Database.run(
      `UPDATE workflows SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  },

  async delete(id) {
    return Database.run('DELETE FROM workflows WHERE id = ?', [id]);
  },

  async updateStep(workflowId, step) {
    // First try to get existing step
    const existing = await Database.get(
      'SELECT * FROM steps WHERE workflow_id = ? AND step_number = ?',
      [workflowId, step.step_number]
    );

    if (existing) {
      await Database.run(
        `UPDATE steps SET data = ?, ai_generated = ?, updated_at = CURRENT_TIMESTAMP WHERE workflow_id = ? AND step_number = ?`,
        [JSON.stringify(step.data), step.ai_generated ? 1 : 0, workflowId, step.step_number]
      );
    } else {
      await Database.run(
        `INSERT INTO steps (workflow_id, step_number, data, ai_generated) VALUES (?, ?, ?, ?)`,
        [workflowId, step.step_number, JSON.stringify(step.data), step.ai_generated ? 1 : 0]
      );
    }

    // Update current_step if this step is beyond current
    const workflow = await this.findById(workflowId);
    if (workflow && step.step_number >= workflow.current_step) {
      await this.update(workflowId, { current_step: step.step_number + 1 });
    }

    return this.getStep(workflowId, step.step_number);
  },

  async getStep(workflowId, stepNumber) {
    const step = await Database.get(
      'SELECT * FROM steps WHERE workflow_id = ? AND step_number = ?',
      [workflowId, stepNumber]
    );
    if (step) {
      step.data = JSON.parse(step.data);
      step.ai_generated = Boolean(step.ai_generated);
    }
    return step;
  },

  async getAllSteps(workflowId) {
    const steps = await Database.all(
      'SELECT * FROM steps WHERE workflow_id = ? ORDER BY step_number',
      [workflowId]
    );
    return steps.map(step => ({
      ...step,
      data: JSON.parse(step.data),
      ai_generated: Boolean(step.ai_generated)
    }));
  }
};
