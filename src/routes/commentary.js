import { Router } from 'express';
import { matchIdParamSchema } from '../validation/matches.js';
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from '../validation/commentary.js';
import { commentary } from '../db/schema.js';
import { db } from '../db/db.js';
import { desc, eq } from 'drizzle-orm';

const MAX_LIMIT = 100;

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get('/', async (req, res) => {
  const paramsValidation = matchIdParamSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      error: 'Invalid match ID.',
      details: paramsValidation.error.issues,
    });
  }

  const queryValidation = listCommentaryQuerySchema.safeParse(req.query);

  if (!queryValidation.success) {
    return res.status(400).json({
      error: 'Invalid query.',
      details: queryValidation.error.issues,
    });
  }

  const { id: matchId } = paramsValidation.data;
  const limit = Math.min(queryValidation.data.limit ?? 100, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({
      error: 'Failed to retrieve commentary.',
    });
  }
});

commentaryRouter.post('/', async (req, res) => {
  const paramsValidation = matchIdParamSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      error: 'Invalid match ID.',
      details: paramsValidation.error.issues,
    });
  }

  const bodyValidation = createCommentarySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      error: 'Invalid payload.',
      details: bodyValidation.error.issues,
    });
  }

  const { id: matchId } = paramsValidation.data;
  const { minutes, ...rest } = bodyValidation.data;

  try {
    const [result] = await db
      .insert(commentary)
      .values({
        matchId,
        minute: minutes,
        ...rest,
      })
      .returning();

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(result.matchId, result);
    }

    res.status(201).json({ data: result });
  } catch (e) {
    res.status(500).json({
      error: 'Failed to create commentary.',
    });
  }
});
