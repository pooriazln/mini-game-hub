// src/redis.service.ts
import { MoveMessage } from '@app/shared/proto/messages';
import Redis from 'ioredis';

export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async publishMove(playerId: string, x: number, y: number) {
    const move: MoveMessage = {
      roomId: 'room1',
      position: {
        playerId,
        x,
        y,
        timestamp: Date.now(),
      },
    };

    const uint8 = MoveMessage.encode(move).finish();
    await this.redis.publish('move_channel', Buffer.from(uint8));
  }

  subscribe() {
    const sub = this.redis.duplicate();
    sub.subscribe('move_channel');

    sub.on('messageBuffer', (channel, messageBuffer) => {
      const decoded = MoveMessage.decode(new Uint8Array(messageBuffer));
      console.log(decoded);
    });
  }
}
