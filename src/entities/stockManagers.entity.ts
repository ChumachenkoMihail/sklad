import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import {ProductsEntity} from "./products.entity";
import {StockEntity} from "./stock.entity";
import {User} from "./users.entity";


@Entity({name: 'stockManagers'})
export class StockManagersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity)
    @JoinColumn({ name: 'stock_id' })
    stock: StockEntity;

    @Column({
        name: 'stock_id',
    })
    stock_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        name: 'user_id',
    })
    user_id: number;
}
