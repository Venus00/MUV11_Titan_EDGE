import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import * as can from "socketcan";
import { CAN_PAYLOAD } from './muv11';
import { MqttService } from 'src/mqtt/mqtt.service';
import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os'
import  * as moment  from 'moment';
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
  private isChecking = false;
  private lastMessageTime = Date.now();
  private isMemoryFull:boolean = false;
  private payload = {
    Metrics: {},
    DeviceId: process.env.DEVICE_ID,
    Timestamp: null,
  };

  constructor(
    private mqttService: MqttService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  async onModuleInit() {
    this.logger.log('[d] init connection with Device ...');
    this.init_device();
    this.logger.log('[d] init requesting from device ...');

    this.checkStorageAvail();
    setInterval(() => {
      this.handleCanPayload();
    }, 10*1000)
  }

  async init_device() {
    try {
      setInterval(async () => {
        // console.log(Date.now() - this.lastMessageTime)
        // if(!this.isChecking)
        // {
        //   this.isChecking = true;
          try {
            if (Date.now() - this.lastMessageTime > 100) {
              await this.restartCAN();
              this.lastMessageTime = Date.now();
            }
          } catch (error) {
  
          }
        //}
       
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

  checkStorageAvail(): string {
    try {
      const result  = execSync(`df -k "/data"`);
      const lines = result.toString().trim().split('\n');
      const [, , , available,] = lines[1].split(/\s+/);

      const availableMB = parseInt(available, 10) / 1024;
      if (availableMB < 7008) {
        console.log("storage is full")
         this.isMemoryFull = true;
      } 
    } catch (e) {
      console.error(`Error retrieving storage: ${(e as Error).message}`);
      return "N/A";
    }
  }


  async restartCAN() {
    try {
      console.log("...")
      exec("sudo ip link set can0 down && sudo  ip link set up can0 type can bitrate 250000", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        this.reader = can.createRawChannel("can0", true);
        this.reader.addListener("onMessage", this.onReaderData.bind(this));
        this.reader.start()
        this.isChecking  = false;
      });

    } catch (error) {
      throw error;
    }

  }

  getTimestampFromRTC() {
    try {
        const result = execSync("sudo hwclock --utc --noadjfile", { encoding: "utf8" }).trim();
        console.log(`Raw RTC time: ${result}`);
        const match = result.match(/([+-]\d{2})(\d{2})$/);
        let totalOffsetMinutes = 0;
        let rtcTimeStr = result;
        if (match) {
            const hoursOffset = parseInt(match[1], 10);
            const minutesOffset = parseInt(match[2], 10);
            totalOffsetMinutes = hoursOffset * 60 + minutesOffset * Math.sign(hoursOffset);
            rtcTimeStr = result.slice(0, -5); 
        }
        let rtcDate = new Date(rtcTimeStr.replace(" ", "T") + "Z");
        rtcDate.setUTCMinutes(rtcDate.getUTCMinutes() - totalOffsetMinutes);
        return rtcDate.toISOString();

    } catch (error) {
        throw new Error(`Error executing hwclock: ${error.message}`);
    }
}


  async handleCanPayload() {
    console.log("date handle "  , new Date())
    //const now = Date.now();
    const payload_length = Object.keys(this.payload.Metrics).length;
    /*//if (payload_length >= 80) {
      this.payload.Timestamp = this.getTimestampFromRTC();
      this.mqttService.publishPayload(JSON.stringify(this.payload));
      this.last_time = Date.now();
      this.payload.Metrics = {};
    }*/
    // if (((now - this.last_time) > 30000) && (payload_length !== 0)) {
    if ((payload_length !== 0)) {
      console.log("publish payload to mqtt")
      this.payload.Timestamp = this.getTimestampFromRTC();	
      this.last_time = Date.now();
      this.mqttService.publishPayload(JSON.stringify(this.payload));
      if(!this.isMemoryFull) this.logPayload(JSON.stringify(this.payload))
      this.payload.Metrics = {};
    }
  }

  async logPayload(payload:string){
    const filename = moment().format('YYYY-MM-DD');
    return  fs.appendFile(`/data/${filename}-can.txt`, payload.toString() + "\n",
    function(err){
        if (err){
            return console.log(err);
        }
    }
);
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
        Object.assign(this.payload.Metrics, metrics)
        //this.logger.log(metrics)
      }

    } catch (error) {
      this.logger.error(error);
    }
  }



  calculateParameters(dataBytes: number[], config: ConfigItem[]): Results {
    const results: Results = {};

    for (const grandeur of config) {
      const nom = grandeur.nom;
      const nomKey = nom.toLowerCase().replaceAll(" ", "_");
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
        if(typeof results[nomKey] ==='boolean')	
        { 
          results[nomKey] = Number(results[nomKey])
        }
      } catch (e) {
        results[nomKey] = `Erreur: ${(e as Error).message}`;
      }
    }

    return results;
  }
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
}
