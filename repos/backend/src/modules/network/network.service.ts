import { Injectable } from '@nestjs/common';
import { CommandService } from 'src/services/command.service';

@Injectable()
export class NetworkService {
  constructor(private readonly commandService: CommandService) {}

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
}
