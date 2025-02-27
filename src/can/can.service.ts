import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import * as can from "socketcan";
import { CAN_PAYLOAD } from './muv11';
import { MqttService } from 'src/mqtt/mqtt.service';
import { execSync } from 'child_process';


type ConfigItem = {
  nom: string;
  formule: string;
  byte: number | number[];
};

type Results = Record<string, number | string | null>;

@Injectable()
export class CanService implements OnModuleInit {
  private reader;
  private readonly logger = new Logger(CanService.name);
  private last_time = new Date().getTime();
  private job;
  private payload = {
    metrics: {},
    deviceId: process.env.DEVICE_ID,
    timeStamp: null,
  };

  constructor(
    private mqttService: MqttService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  async onModuleInit() {
    this.logger.log('[d] init connection with Device ...');
    this.init_device();
    this.logger.log('[d] init requesting from device ...');
    setInterval(() => {
      this.handleCanPayload();
    }, 50)
  }

  init_device() {
    try {
      this.reader = can.createRawChannel("can0", true);
      this.reader.addListener("onMessage", this.onReaderData.bind(this));
      this.reader.start();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  getTimestampFromRtc(): string {
    try {
      const result = execSync("date -u +'%Y-%m-%dT%H:%M:%SZ'", { encoding: "utf-8" }).trim();
      console.log(`RTC time: ${result}`);
      return result;
    } catch (e) {
      throw new Error(`Error executing date command: ${(e as Error).message}`);
    }
  }

  async handleCanPayload() {
    const now = new Date().getTime();
    const payload_length = Object.keys(this.payload.metrics).length;
    if (payload_length === 20) {

      this.mqttService.publishPayload(JSON.stringify(this.payload));
    }
    else if (((now - this.last_time) / 1000 > 1000) && payload_length !== 0) {
      this.mqttService.publishPayload(JSON.stringify(this.payload));
    }
  }


  // startHandleMqttData(seconds: number) {
  //   this.logger.log('[d] create Handle data from CAN ');
  //   this.job = new CronJob(
  //     `*/${seconds} * * * * *`,
  //     this.handleRequestJob.bind(this),
  //   );
  //   this.schedulerRegistry.addCronJob('request', this.job);
  //   this.job.start();
  // }

  async onReaderClose() {
    this.logger.error('PORT CLOSED');
  }
  onReaderData(data: any) {
    try {
      console.log(data);
      const can_id = parseInt(data.id).toString(16)
      this.logger.log("can Id : ", can_id)
      const buffer = data.data;
      if (can_id in CAN_PAYLOAD) {

        const config = CAN_PAYLOAD[can_id].grandeurs;
        const metrics = this.calculateParameters(buffer, config);
        this.payload.metrics = metrics;
        this.payload.deviceId = can_id;
        this.payload.timeStamp = this.getTimestampFromRtc();
        console.log(JSON.stringify(metrics))
      }

    } catch (error) {
      this.logger.error(error);
    }
  }



  calculateParameters(dataBytes: number[], config: ConfigItem[]): Results {
    const results: Results = {};

    for (const grandeur of config) {
      const nom = grandeur.nom;
      const nomKey = nom.toLowerCase().replace(" ", "_");
      const formule = grandeur.formule;
      const byteIndices = grandeur.byte;

      try {
        let formulaVars: Record<string, number> = {};

        if (Array.isArray(byteIndices)) {
          formulaVars = Object.fromEntries(byteIndices.map(i => [`byte_${i}`, dataBytes[i]]));
        } else {
          formulaVars[`byte_${byteIndices}`] = dataBytes[byteIndices];
        }

        let value: number | null = null;
        if (formule !== "NaN") {
          value = new Function(...Object.keys(formulaVars), `return ${formule};`)(...Object.values(formulaVars));
        }

        results[nomKey] = typeof value === "number" ? parseFloat(value.toFixed(2)) : value;
      } catch (e) {
        results[nomKey] = `Erreur: ${(e as Error).message}`;
      }
    }

    return results;
  }
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
}
