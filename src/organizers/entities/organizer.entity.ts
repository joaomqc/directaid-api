import { EventEntity } from 'src/events/entities/event.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organizer')
export class OrganizerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    location: string;

    @Column('text')
    description: string;

    @OneToOne(() => UserEntity, user => user.organizer)
    @JoinColumn()
    user: UserEntity;
    
    @OneToMany(() => EventEntity, event => event.organizer)
    @JoinColumn()
    eventsCreated: EventEntity[];

    @ManyToMany(() => UserEntity, user => user.organizersFollowing)
    usersFollowing: UserEntity[];
}
