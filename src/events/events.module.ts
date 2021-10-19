import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventEntity])],
    providers: [EventsResolver, EventsService]
})
export class EventsModule { }