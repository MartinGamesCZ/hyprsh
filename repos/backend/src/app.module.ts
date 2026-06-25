import { Module } from '@nestjs/common';
import { WindowModule } from './modules/window/window.module';
import { HyprlandModule } from './modules/hyprland/hyprland.module';
import { NetworkModule } from './modules/network/network.module';
import { ServicesModule } from './services/services.module';
import { PowerModule } from './modules/power/power.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ServicesModule,
    WindowModule,
    HyprlandModule,
    NetworkModule,
    PowerModule,
    EventsModule,
  ],
})
export class AppModule {}
