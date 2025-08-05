/**
 * @file      frontend/app/(routes)/(private)/chat/[characterCode]/_types/index.d.ts
 * @desc      Type
 *
 * @author    최준호
 * @update    2025.08.05
 */

export interface Message {
  uuid: string;
  sender: string;
  text: string;
  created_at: string;
  reactions?: { [emoji: string]: string[] };
}
