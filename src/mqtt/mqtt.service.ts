import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import { CanService } from 'src/can/can.service';
import { commands } from 'src/can/commands';
import { execSync } from 'child_process';
@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private logger = new Logger(MqttService.name);
  private mac: string;
  private TOPIC_PUBLISH_PAYLOAD: string;
  private TOPIC_PUBLISH_STATUS: string;
  protected total_event: number = 0;
  protected total_alert: number = 0;
  constructor() { }

  async onModuleInit() {
    this.logger.log(process.env.MQTT_SERVER);
    this.TOPIC_PUBLISH_PAYLOAD = process.env.TOPIC_PUBLISH
    this.TOPIC_PUBLISH_STATUS = process.env.TOPIC_STATUS

    this.mac = execSync(
      `ifconfig wlan0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'`,
    )
      .toString()
      .replaceAll(':', '')
      .trim();
    this.logger.log('mac', this.mac);
    this.client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}`, {
      //clientId: this.mac,
      reconnectPeriod: 1,
    });
    this.client.on('connect', this.onConnect.bind(this));
    this.client.on('disconnect', this.onDisconnect.bind(this));
  }

  onConnect() {
    this.logger.log('mqtt server is connected');
  }
  onDisconnect() {
    this.logger.error('mqtt server is disconnected');
  }
  publishStatus(message: string) {
    this.logger.log(this.TOPIC_PUBLISH_STATUS);
    this.client.publish(this.TOPIC_PUBLISH_STATUS, message);
  }
  publishPayload(message: string) {
    this.client.publish(this.TOPIC_PUBLISH_PAYLOAD, message);
  }

  getConnectionState() {
    return this.client.connected;
  }
}
