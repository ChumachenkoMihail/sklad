import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany,
} from 'typeorm';
import {User} from "./users.entity";
import {StockProductsEntity} from "./stockProducts.entity";


@Entity({name: 'stock'})
export class StockEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        nullable: false
    })
    address: string;

    @Column({
        nullable: true
    })
    total: number;

    @ManyToOne(() => User, (user) => user.stocks)
    user: User;

    // @OneToMany(() => StockProductsEntity, (stockProducts) => stockProducts.game)
    // stockProducts?: StockProductsEntity[];
}
