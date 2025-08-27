package main

import (
	"context"
	"fmt"

	pb "go-engine/internal/generated"

	"google.golang.org/protobuf/proto"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

var ctx = context.Background()

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	logger.Info("Starting Go Engine...")

	rdb := redis.NewClient(
		&redis.Options{
			Addr: "localhost:6379",
		},
	)

	sub := rdb.Subscribe(ctx, "move_channel")
	ch := sub.Channel()

	for msg := range ch {
		data := []byte(msg.Payload)

		move := &pb.MoveMessage{}
		if err := proto.Unmarshal(data, move); err != nil {
			logger.Error("unmarshal error:", zap.Error(err))
			continue
		}

		logger.Info("player moved",
			zap.String("playerId", move.Position.PlayerId),
			zap.Float32("x", move.Position.X),
			zap.Float32("y", move.Position.Y),
		)

		fmt.Printf("Player %s moved to (%.2f, %.2f)\n",
			move.Position.PlayerId, move.Position.X, move.Position.Y)
	}

}
