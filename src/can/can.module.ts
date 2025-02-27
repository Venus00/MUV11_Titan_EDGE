import { Module, forwardRef } from '@nestjs/common';
import { CanService } from './can.service';
import { SyncService } from './sync.service';
import { MqttModule } from 'src/mqtt/mqtt.module';
@Module({
  imports: [MqttModule],
  providers: [CanService, SyncService],
  exports: [CanService]
})
export class CanModule { }
