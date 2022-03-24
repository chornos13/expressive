import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('articleDetail')
export default class ArticleDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  description!: string
}
