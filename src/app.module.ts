import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {
  StatusMonitorModule,
  StatusMonitorConfiguration,
} from 'nest-status-monitor';
import { HealthModule } from './health/health.module';
import { AppGateway } from './app.gateway';
import { ChatGateway } from './chat.gateway';

const portNumber = parseInt(process.env.PORT) || 3000;
const statusMonitorConfig: StatusMonitorConfiguration = {
  pageTitle: 'Nest.js Status Monitor', // Default title
  path: '/status',
  port: 3001,
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    },
  ],
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/health/alive',
      port: portNumber,
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/health/dead',
      port: portNumber,
    },
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  ignoreStartsWith: '/health/alive',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StatusMonitorModule.setUp(statusMonitorConfig),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    HealthModule,
  ],
  providers: [AppGateway, ChatGateway],
})
export class AppModule {}
