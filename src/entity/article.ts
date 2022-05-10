import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import ArticleDetailEntity from '@src/entity/articleDetail'

@Entity('article')
export default class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  minuteReadingTime!: number

  @Column()
  wordCount!: number

  @OneToOne(() => ArticleDetailEntity)
  @JoinColumn()
  articleDetail!: ArticleDetailEntity

  @CreateDateColumn()
  public createdAt?: Date

  @UpdateDateColumn()
  public updatedAt?: Date

  @VersionColumn()
  version?: number
}
