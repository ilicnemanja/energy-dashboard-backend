// NestJS Essential
import { Module } from '@nestjs/common';

// Modules
import { SharedModule } from './shared/shared.module';
import { SolarModule } from './solar/solar.module';

// Contronllers
import { AppController } from './app.controller';

// Services
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { SolarMeasurement } from './solar/entities/solar-measurement.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'postgres'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get<string>('POSTGRES_DB', 'energy_dashboard'),
        entities: [SolarMeasurement],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        retryAttempts: 10,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    SolarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
