import { Module } from '@nestjs/common';
import { CanModule } from './can/can.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(), 
    MqttModule, 
    CanModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
