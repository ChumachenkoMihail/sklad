import {
    Entity,
    Column,
    PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany, ManyToMany,
} from 'typeorm';
import {User} from "./users.entity";


@Entity({ name: 'categories' })
export class CategoriesEntity {
    @PrimaryGeneratedColumn( )
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @ManyToOne(() => User, (user) => user.stocks)
    user: User;

    @ManyToOne(()=> CategoriesEntity, (category) => category.id, {onDelete: "CASCADE"})
    parent: CategoriesEntity;
}
