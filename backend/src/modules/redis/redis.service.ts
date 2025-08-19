import { Injectable } from '@nestjs/common';
import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit {
    private client : RedisClientType

    constructor( private configService: ConfigService) {
    }

    async onModuleInit() {
        // this.client = createClient({ url: this.configService.get<string>('REDIS_URL') });
        // this.client.on('error', (err) => console.error('Redis Client Error', err));
        // await this.client.connect();
    }

    getClient(): RedisClientType {
      return this.client;
    }
}
