import { Column, Entity, PrimaryColumn } from "typeorm";
import { Service } from "typedi";

@Service()
@Entity({ name: "movies" })
export class MovieEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  year!: string;

  @Column({ nullable: true })
  poster?: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true, type: "text" })
  plot?: string;
}
