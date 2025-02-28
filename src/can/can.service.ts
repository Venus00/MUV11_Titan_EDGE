import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import * as can from "socketcan";
import { CAN_PAYLOAD } from './muv11';
import { MqttService } from 'src/mqtt/mqtt.service';
import { exec, execSync } from 'child_process';

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
  private last_time = Date.now();
  private counter = 0;
  private canId = undefined;
  private lastMessageTime = Date.now()
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

  async init_device() {
    try {
      setInterval(async () => {
        // console.log(Date.now() - this.lastMessageTime)

        try {
          if (Date.now() - this.lastMessageTime > 10) {
            await this.restartCAN();
            this.lastMessageTime = Date.now();
          }
        } catch (error) {

        }
      }, 1000);

      this.reader = can.createRawChannel("can0", true);
      this.reader.addListener("onMessage", this.onReaderData.bind(this));
      this.reader.start();


      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  async restartCAN() {
    try {
      execSync("sudo ip link set can0 down && sudo ip link set up can0 type can bitrate 250000");
      this.reader = can.createRawChannel("can0", true);
      this.reader.addListener("onMessage", this.onReaderData.bind(this));
      this.reader.start()
    } catch (error) {
      throw error;
    }

  }

  getTimestampFromRtc(): string {
    try {
      const result = exec("date -u +'%Y-%m-%dT%H:%M:%SZ'", { encoding: "utf-8" }).toString().trim();
      console.log(`RTC time: ${result}`);
      return result;
    } catch (e) {
      throw new Error(`Error executing date command: ${(e as Error).message}`);
    }
  }

  async handleCanPayload() {
    const now = Date.now();
    const payload_length = Object.keys(this.payload.metrics).length;
    console.log("payload", payload_length)
    if (payload_length >= 80) {
      this.mqttService.publishPayload(JSON.stringify(this.payload));
      this.payload.metrics = {};
    }
    else if (((now - this.last_time) > 1000) && (payload_length !== 0)) {
      console.log("publish payload")
      this.mqttService.publishPayload(JSON.stringify(this.payload));
      this.payload.metrics = {};
      this.last_time = Date.now();
    }
  }

  onReaderData(data: any) {
    try {
      this.lastMessageTime = Date.now();

      const can_id = parseInt(data.id).toString(16)
      //this.logger.log("can Id : ", can_id)
      const buffer = data.data;
      if (can_id in CAN_PAYLOAD) {
        const config = CAN_PAYLOAD[can_id].grandeurs;
        const metrics = this.calculateParameters(buffer, config);
        Object.assign(this.payload.metrics, metrics)
        this.payload.deviceId = can_id;
        //this.payload.timeStamp = this.getTimestampFromRtc();
        this.logger.log(metrics)
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
