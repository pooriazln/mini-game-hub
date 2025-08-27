import { Client, Room } from 'colyseus';
import { GameState } from './schema/GameState';
import { Player } from './schema/Player';
import { MessageTypes } from './types/MessageTypes';
import { RedisService } from '../redis/redis.service';
import { MoveDto } from './dto/move.dto';
import { validate } from 'class-validator';

export class MiniGameRoom extends Room<GameState> {
  private redisSerivce: RedisService;

  onCreate(options: any) {
    this.state = new GameState();
    this.redisSerivce = new RedisService();

    this.onMessage(MessageTypes.MOVE, async (client, message: MoveDto) => {
      const data = Object.assign(new MoveDto(), message);
      const errors = await validate(data);

      if (errors.length > 0) {
        client.send(MessageTypes.ERROR, { message: errors.toString() });
        return;
      }

      const player = this.state.players.get(client.sessionId);

      if (player) {
        this.redisSerivce.publishMove(player.id, data.x, data.y);
      }
    });

    console.log('MiniGameRoom created!');
  }

  onJoin(client: Client): void | Promise<any> {
    const player = new Player();
    player.id = client.sessionId;

    this.state.players.set(player.id, player);

    console.log(client.sessionId, 'joined!');
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, 'left!');
  }
}
