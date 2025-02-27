import { Module, forwardRef } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { CanModule } from 'src/can/can.module';
@Module({
  imports: [],
  providers: [MqttService],
  exports: [MqttService]
})
export class MqttModule { }
