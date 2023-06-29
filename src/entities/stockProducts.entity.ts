import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import {ProductsEntity} from "./products.entity";
import {StockEntity} from "./stock.entity";


@Entity({name: 'stockProducts'})
export class StockProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'stock_id' })
    stock: StockEntity;

    @Column({
        name: 'stock_id',
    })
    stock_id: number;

    @ManyToOne(() => ProductsEntity, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'product_id' })
    product: ProductsEntity;

    @Column({
        name: 'product_id',
    })
    product_id: number;

    @Column()
    count: number;
}
