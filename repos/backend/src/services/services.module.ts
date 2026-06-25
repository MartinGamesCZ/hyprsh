import { Global, Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { DbusService } from './dbus.service';

@Global()
@Module({
  imports: [],
  providers: [CommandService, DbusService],
  exports: [CommandService, DbusService],
})
export class ServicesModule {}
