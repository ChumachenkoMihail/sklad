import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import {StockEntity} from "./stock.entity";
import {User} from "./users.entity";
import {ProductsEntity} from "./products.entity";


@Entity({name: 'productsManager'})
export class ProductsManagerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductsEntity)
    @JoinColumn({ name: 'product_id' })
    product: ProductsEntity;

    @Column({
        name: 'product_id',
    })
    product_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        name: 'user_id',
    })
    user_id: number;
}
