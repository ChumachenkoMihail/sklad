import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import {User} from "./users.entity";


@Entity({name: 'members'})
export class MembersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({
        name: 'owner_id',
    })
    owner_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'member_id' })
    member: User;

    @Column({
        name: 'member_id',
    })
    member_id: number;



}
