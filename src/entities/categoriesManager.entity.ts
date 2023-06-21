import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import {User} from "./users.entity";
import {ProductsEntity} from "./products.entity";
import {CategoriesEntity} from "./categories.entity";


@Entity({name: 'categoriesManager'})
export class CategoriesManagerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CategoriesEntity)
    @JoinColumn({ name: 'category_id' })
    product: CategoriesEntity;

    @Column({
        name: 'category_id',
    })
    category_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        name: 'user_id',
    })
    user_id: number;
}
