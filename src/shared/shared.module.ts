import { Module } from '@nestjs/common';

// Modules
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class SharedModule {}
