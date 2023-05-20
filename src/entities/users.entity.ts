import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import {StockEntity} from "./stock.entity";


@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    email: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        nullable: true,
    })
    refreshToken: string;

    @OneToMany(() => StockEntity, (stock) => stock.user)
    stocks: StockEntity[];
}
