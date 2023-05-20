import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToOne, JoinColumn,
} from 'typeorm';
import {StockEntity} from "./stock.entity";
import {StockProductsEntity} from "./stockProducts.entity";
import {User} from "./users.entity";
import {CategoriesEntity} from "./categories.entity";


@Entity({ name: 'products' })
export class ProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column()
    description: string;

    @Column({
        nullable: true,
        type: "jsonb"
    })
    properties: string;

    @Column({
        nullable: true,
    })
    image: string;

    @Column({
        nullable: true,
        unique: true
    })
    vendorCode: string;

    @Column({
        nullable: true,
    })
    price: number;

    @ManyToOne(() => User, (user) => user.stocks)
    user: User;

    @ManyToOne(() => CategoriesEntity, {onDelete: "SET NULL"})
    category: CategoriesEntity;
}
