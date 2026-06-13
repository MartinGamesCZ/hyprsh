import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NetworkService } from './network.service';

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

  @Get('/bluetooth/details')
  async getBluetoothDetails() {
    return await this.networkService.getBluetoothDetails();
  }
}
