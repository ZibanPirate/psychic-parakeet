import { Column, Entity, PrimaryColumn } from "typeorm";
import { IsString } from "class-validator";
import { Service } from "typedi";

@Service()
@Entity({ name: "movies" })
export class MovieEntity {
  @PrimaryColumn()
  @IsString()
  id!: string;

  @Column()
  @IsString()
  title!: string;

  @Column()
  @IsString()
  year!: string;

  @Column({ nullable: true })
  @IsString()
  poster?: string;

  @Column({ nullable: true })
  @IsString()
  director?: string;

  @Column({ nullable: true, type: "text" })
  @IsString()
  plot?: string;
}
