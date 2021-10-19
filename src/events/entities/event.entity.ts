import { OrganizerEntity } from 'src/organizers/entities/organizer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event')
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('timestamp with time zone')
    date: Date;

    @Column('timestamp with time zone', { default: () => "(now() at time zone 'utc')" })
    creationDate: Date;

    @Column('text')
    location: string;

    @ManyToOne(() => OrganizerEntity, organizer => organizer.eventsCreated)
    organizer: OrganizerEntity;

    @ManyToMany(() => UserEntity, user => user.eventsFollowing)
    usersFollowing: UserEntity[];
}
