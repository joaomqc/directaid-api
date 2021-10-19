import { EventEntity } from 'src/events/entities/event.entity';
import { OrganizerEntity } from 'src/organizers/entities/organizer.entity';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    @Index({ unique: true })
    email: string;

    @Column('text')
    name: string;

    @Column('text', { select: false })
    password: string;

    @Column('timestamp with time zone', { default: () => "(now() at time zone 'utc')" })
    creationDate: Date = new Date();
    
    @OneToOne(() => OrganizerEntity, organizer => organizer.user)
    organizer: OrganizerEntity;

    @ManyToMany(() => OrganizerEntity, organizer => organizer.usersFollowing)
    @JoinTable()
    organizersFollowing: OrganizerEntity[];

    @ManyToMany(() => EventEntity, event => event.usersFollowing)
    @JoinTable()
    eventsFollowing: EventEntity[];
}