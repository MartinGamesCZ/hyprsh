import { Body, Controller, Get, Post, Query, Sse } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';

@Controller('/network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('/wifi/details')
  async getWifiDetails() {
    return await this.networkService.getWifiDetails();
  }

  @Get('/wifi/list')
  async listWifi(@Query('rescan') rescan?: string) {
    const shouldRescan = rescan === 'true';

    return await this.networkService.listWifi(shouldRescan);
  }

  @Post('/wifi/connect')
  async connectWifi(@Body('ssid') ssid: string) {
    return await this.networkService.connectWifi(ssid);
  }

  @Get('/wifi/status')
  async getWifiStatus() {
    return await this.networkService.getWifiStatus();
  }

  @Post('/wifi/power')
  async toggleWifiPower(@Body('enabled') enabled: boolean | string) {
    const isEnabled = typeof enabled === 'string' ? enabled === 'true' : Boolean(enabled);
    return await this.networkService.toggleWifiPower(isEnabled);
  }

  @Get('/bluetooth/details')
  async getBluetoothDetails() {
    return await this.networkService.getBluetoothDetails();
  }
}
