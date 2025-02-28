import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { commands } from './commands';
import { CronJob, CronTime } from 'cron';
import * as can from "socketcan";
import { exec, execSync } from 'child_process';
import { MqttService } from 'src/mqtt/mqtt.service';
import { networkInterfaces } from 'os';

@Injectable()
export class SyncService implements OnModuleInit {

  private readonly logger = new Logger(SyncService.name);
  private payload = {
    deviceId: process.env.DEVICE_ID,
    mac_address: null,
    ip_address: '',
    uptime_s: null,
    uptime: null,
    storage_avail: null,
    time_stamp: null
  }
  constructor(
    private mqttService: MqttService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  async onModuleInit() {
    this.logger.log('[d] syncronisation service ...');
    this.payload.mac_address = this.getMacAddress();
    this.syncTimeWithNtp(process.env.NTP_SERVER);
    this.updateRtc();
  }

  @Cron('* * * * * *')
  handleSyncronisation() {

    console.log("publish status");
    this.payload.ip_address = this.getIpAddress();
    this.payload.uptime = this.getUptime();
    this.payload.uptime_s = this.getUptimeS();
    this.payload.storage_avail = this.getStorageAvail();
    this.payload.time_stamp = this.getTimestampFromRtc();
    this.mqttService.publishStatus(JSON.stringify(this.payload));
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
  getMacAddress() {
    try {
      return execSync(
        `ifconfig wlan0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'`,
      )
        .toString()
        .replaceAll(':', '')
        .trim();
    } catch (error) {
      return 'Unknown'
    }

  }
  getIpAddress(): string {
    try {
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
          if (net.family === "IPv4" && !net.internal) {
            return net.address;
          }
        }
      }
      return "Unknown";
    } catch (e) {
      return "Unknown";
    }
  }


  syncTimeWithNtp(ntpServer) {
    console.log(`Synchronizing time with NTP server: ${ntpServer}`);
    try {
      exec(`sudo ntpdate ${ntpServer}`);
      console.log("System time synchronized with NTP server.");
    } catch (e) {
      console.error(`Failed to sync time: ${(e as Error).message}`);
    }
  }

  updateRtc() {
    console.log("Updating RTC with system time...");
    try {
      execSync(`sudo hwclock --systohc`);
      console.log("RTC updated successfully.");
    } catch (e) {
      console.error(`Failed to update RTC: ${(e as Error).message}`);
    }
  }


  getUptimeS(): string {
    try {
      const result = execSync("uptime -s", { encoding: "utf-8" }).trim();
      return result.replace(" ", "T");
    } catch (e) {
      throw new Error(`Error executing 'uptime -s': ${(e as Error).message}`);
    }
  }

  getUptime(): string {
    try {
      const result = execSync("uptime", { encoding: "utf-8" }).trim();
      const parts = result.split("up", 2);
      if (parts.length > 1) {
        return parts[1].split(",")[0].trim().replace(" ", "");
      }
      return "Unknown";
    } catch (e) {
      throw new Error(`Error executing 'uptime': ${(e as Error).message}`);
    }
  }

  getStorageAvail(): string {
    try {
      const result = execSync("df -h /usr/share", { encoding: "utf-8" });
      const lines = result.split("\n");
      if (lines.length > 1) {
        const storageInfo = lines[1].split(/\s+/);
        return storageInfo[3];
      }
      return "N/A";
    } catch (e) {
      console.error(`Error retrieving storage: ${(e as Error).message}`);
      return "N/A";
    }
  }
}
