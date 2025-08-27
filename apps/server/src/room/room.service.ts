import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RoomService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async sendMoveMessage(
    roomId: string,
    playerId: string,
    x: number,
    y: number,
    z: number,
  ) {
    const message = JSON.stringify({
      roomId,
      playerId,
      x,
      y,
      z,
      timestamp: Date.now(),
    });
    await this.redis.publish('move_channel', message);
  }

  subscribeToMoves(callback: (msg: any) => void) {
    const sub = this.redis.duplicate();
    sub.subscribe('move_channel', () => {});
    sub.on('message', (channel, message) => {
      callback(JSON.parse(message));
    });
  }
}
