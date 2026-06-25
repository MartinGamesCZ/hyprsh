import { Injectable } from '@nestjs/common';
import { ClientInterface, systemBus } from 'dbus-next';

type IDBusListener = (...args: any[]) => void;

@Injectable()
export class DbusService {
  private readonly bus = systemBus();

  async addListener(service: string, path: string, listener: IDBusListener) {
    const object = await this.bus.getProxyObject(service, path);
    const int = object.getInterface('org.freedesktop.DBus.Properties');

    const handler = (_: any, data: Record<string, { value: any }>) => {
      const key = Object.keys(data)[0];

      if (key) listener(key, data[key].value);
    };

    int.on('PropertiesChanged', handler);

    return () => int.off('PropertiesChanged', handler);
  }

  async getInterface(service: string, path: string, ifname: string) {
    const object = await this.bus.getProxyObject(service, path);
    return object.getInterface(ifname);
  }

  async getPropertiesInterface(service: string, path: string) {
    return await this.getInterface(
      service,
      path,
      'org.freedesktop.DBus.Properties',
    );
  }
}
