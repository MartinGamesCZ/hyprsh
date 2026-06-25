import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandService } from 'src/services/command.service';
import { DbusService } from 'src/services/dbus.service';
import { EventsService } from '../events/events.service';

export enum EWifiState {
  NM_STATE_UNKNOWN = 0,
  NM_STATE_ASLEEP = 10,
  NM_STATE_DISCONNECTED = 20,
  NM_STATE_DISCONNECTING = 30,
  NM_STATE_CONNECTING = 40,
  NM_STATE_CONNECTED_LOCAL = 50,
  NM_STATE_CONNECTED_SITE = 60,
  NM_STATE_CONNECTED_GLOBAL = 70,
}

@Injectable()
export class NetworkService implements OnModuleInit {
  private dbusWifiDevicePath: string | null = null;
  private activeApListenerCleanup: (() => void) | null = null;

  private readonly logger = new Logger(NetworkService.name);

  constructor(
    private readonly commandService: CommandService,
    private readonly dbusService: DbusService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit() {
    this.dbusService.addListener(
      'org.freedesktop.NetworkManager',
      '/org/freedesktop/NetworkManager',
      (prop: string, val: any) => {
        if (prop == 'WirelessEnabled') this.$handleWifiWirelessEnabled(val);
      },
    );

    const wifiPath = await this.$getWifiDBusPath();
    if (!wifiPath) {
      this.logger.warn('Could not find wifi device');

      return;
    }

    this.logger.log(`Found wifi dbus path: ${wifiPath}`);

    this.dbusService.addListener(
      'org.freedesktop.NetworkManager',
      wifiPath,
      (prop: string, val: any) => {
        if (prop == 'ActiveAccessPoint') this.$handleWifiActiveAccessPoint(val);
      },
    );

    await this.$checkInitialActiveAccessPoint(wifiPath);
  }

  async getWifiDetails(): Promise<{
    ssid: string;
    strength: number;
  } | null> {
    const output = await this.commandService.execAsync('nmcli', [
      '-t',
      '-f',
      'active,ssid,signal,rate',
      'dev',
      'wifi',
    ]);

    const line = output.split('\n').find((l) => l.startsWith('yes:'));
    if (!line) return null;

    const [_active, ssid, signal] = line.split(':');

    return { ssid, strength: parseInt(signal) };
  }

  async listWifi(rescan: boolean = false): Promise<
    {
      active: boolean;
      ssid: string;
      signal: number;
      open: boolean;
    }[]
  > {
    const args = [
      '-t',
      '-f',
      'active,ssid,signal,security',
      'dev',
      'wifi',
      'list',
      '--rescan',
      rescan ? 'yes' : 'no',
    ];

    const output = await this.commandService.execAsync('nmcli', args);
    const lines = output.split('\n').filter((l) => l.trim().length > 0);

    const map = new Map<
      string,
      {
        active: boolean;
        ssid: string;
        signal: number;
        open: boolean;
      }
    >();

    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length < 4) continue;

      const active = parts[0] === 'yes';
      const security = parts[parts.length - 1];
      const signalStr = parts[parts.length - 2];
      const signal = parseInt(signalStr, 10) || 0;

      const ssidParts = parts.slice(1, parts.length - 2);
      const ssid = ssidParts.join(':').replace(/\\:/g, ':');

      if (!ssid) continue;

      const open = security === '--' || security.trim() === '';

      const existing = map.get(ssid);
      if (
        !existing ||
        active ||
        (!existing.active && signal > existing.signal)
      ) {
        map.set(ssid, {
          active: existing?.active || active,
          ssid,
          signal,
          open,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return b.signal - a.signal;
    });
  }

  async connectWifi(ssid: string) {
    await this.commandService.execAsync('nmcli', [
      'device',
      'wifi',
      'connect',
      ssid,
      '--ask',
    ]);
  }

  async getWifiStatus(): Promise<{
    powered: boolean;
  }> {
    const output = await this.commandService.execAsync('nmcli', [
      'radio',
      'wifi',
    ]);

    return {
      powered: output.trim() == 'enabled',
    };
  }

  async toggleWifiPower(enabled: boolean) {
    await this.commandService.execAsync('nmcli', [
      'radio',
      'wifi',
      enabled ? 'on' : 'off',
    ]);
  }

  async getBluetoothDetails(): Promise<{
    powered: boolean;
    connected: boolean;
  }> {
    const showOutput = await this.commandService.execAsync('bluetoothctl', [
      'show',
    ]);

    const lines = showOutput.split('\n').filter((l) => l.trim().length > 0);
    const powered =
      lines
        .find((l) => l.trim().startsWith('Powered:'))
        ?.split(':')?.[1]
        ?.trim() == 'yes';

    const devicesOutput = await this.commandService.execAsync('bluetoothctl', [
      'devices',
      'Connected',
    ]);

    const devicesLines = devicesOutput
      .split('\n')
      .filter((l) => l.trim().length > 0);
    const connected = devicesLines.length > 0;

    return {
      powered,
      connected,
    };
  }

  // --- DBus ---
  private async $getWifiDBusPath() {
    if (this.dbusWifiDevicePath) return this.dbusWifiDevicePath;

    const int = await this.dbusService.getInterface(
      'org.freedesktop.NetworkManager',
      '/org/freedesktop/NetworkManager',
      'org.freedesktop.NetworkManager',
    );
    const devices: string[] = await int.GetDevices();

    for (const device of devices) {
      const deviceInterface: any =
        await this.dbusService.getPropertiesInterface(
          'org.freedesktop.NetworkManager',
          device,
        );
      const deviceType = await deviceInterface.Get(
        'org.freedesktop.NetworkManager.Device',
        'DeviceType',
      );

      // 2 - NM_DEVICE_TYPE_WIFI
      if (deviceType.value == 2) {
        this.dbusWifiDevicePath = device;

        return device;
      }
    }

    return null;
  }

  // --- Events ---
  private $handleWifiWirelessEnabled(value: boolean) {
    this.eventsService.emit('wifi.power', value);

    if (!value) this.$handleWifiActiveAccessPoint('/');
  }

  private async $handleWifiActiveAccessPoint(dbusPath: string) {
    if (this.activeApListenerCleanup) {
      this.activeApListenerCleanup();
      this.activeApListenerCleanup = null;
    }

    if (!dbusPath || dbusPath === '/') {
      this.eventsService.emit('wifi.ssid', null);
      this.eventsService.emit('wifi.strength', null);

      return;
    }

    try {
      const apInterface = await this.dbusService.getPropertiesInterface(
        'org.freedesktop.NetworkManager',
        dbusPath,
      );

      const ssidVariant = await apInterface.Get(
        'org.freedesktop.NetworkManager.AccessPoint',
        'Ssid',
      );
      const ssid = ssidVariant.value.toString('utf-8');

      const strengthVariant = await apInterface.Get(
        'org.freedesktop.NetworkManager.AccessPoint',
        'Strength',
      );
      const strength = strengthVariant.value;

      this.eventsService.emit('wifi.ssid', ssid);
      this.eventsService.emit('wifi.strength', strength);

      this.activeApListenerCleanup = await this.dbusService.addListener(
        'org.freedesktop.NetworkManager',
        dbusPath,
        (prop: string, val: any) => {
          if (prop === 'Strength')
            this.eventsService.emit('wifi.strength', val);
          if (prop === 'Ssid') {
            const newSsid = val.toString('utf-8');
            this.eventsService.emit('wifi.ssid', newSsid);
          }
        },
      );
    } catch (err) {
      this.logger.error(
        `Failed to handle active access point ${dbusPath}: ${err.message}`,
      );

      this.eventsService.emit('wifi.ssid', null);
      this.eventsService.emit('wifi.strength', null);
    }
  }

  private async $checkInitialActiveAccessPoint(wifiPath: string) {
    try {
      const devProps = await this.dbusService.getPropertiesInterface(
        'org.freedesktop.NetworkManager',
        wifiPath,
      );
      const activeApVariant = await devProps.Get(
        'org.freedesktop.NetworkManager.Device.Wireless',
        'ActiveAccessPoint',
      );

      if (activeApVariant && activeApVariant.value)
        await this.$handleWifiActiveAccessPoint(activeApVariant.value);
    } catch (err) {
      this.logger.error(
        `Failed to get initial active access point: ${err.message}`,
      );
    }
  }
}
