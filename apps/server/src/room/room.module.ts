import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import Redis from 'ioredis';

const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({ host: 'localhost', port: 6379 });
  },
};

@Module({
  providers: [RoomService, RedisProvider],
  exports: [RedisProvider],
  controllers: [RoomController],
})
export class RoomModule {}
