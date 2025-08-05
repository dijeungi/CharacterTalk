/**
 * @file      frontend/app/api/messages/[message_uuid]/reactions/route.ts
 * @desc
 *
 * @author    최준호
 * @update    2025.08.05
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import { getUserIdFromRequest } from '@/app/_lib/auth';

export async function POST(req: NextRequest) {
  let userId: number;
  try {
    userId = await getUserIdFromRequest(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }

  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const message_uuid = segments[3];

  if (!message_uuid) {
    return NextResponse.json({ error: 'Message UUID is required' }, { status: 400 });
  }

  const { emoji } = await req.json();
  if (!emoji) {
    return NextResponse.json({ error: 'Emoji is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const messageResult = await client.query('SELECT id FROM chat_messages WHERE uuid = $1', [
      message_uuid,
    ]);
    if (messageResult.rows.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    const messageId = messageResult.rows[0].id;

    const reactionResult = await client.query(
      'SELECT id FROM reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3',
      [messageId, userId, emoji]
    );

    if (reactionResult.rows.length > 0) {
      const reactionId = reactionResult.rows[0].id;
      await client.query('DELETE FROM reactions WHERE id = $1', [reactionId]);
      return NextResponse.json({ message: 'Reaction removed' }, { status: 200 });
    } else {
      await client.query('INSERT INTO reactions (message_id, user_id, emoji) VALUES ($1, $2, $3)', [
        messageId,
        userId,
        emoji,
      ]);
      return NextResponse.json({ message: 'Reaction added' }, { status: 201 });
    }
  } catch (error) {
    console.error('Reaction API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
