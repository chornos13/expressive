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
  BeforeInsert,
  BeforeUpdate,
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

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = new Date()
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = new Date()
  }

  @VersionColumn()
  version?: number
}
