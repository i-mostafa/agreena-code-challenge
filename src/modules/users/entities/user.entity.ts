import { Coordinates } from "helpers/interfaces";
import { Farm } from "modules/farms/entities/farm.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public address: string;

  @Column({ type: "json" })
  public coordinates: Coordinates;

  @OneToMany(() => Farm, farm => farm.owner)
  public farms: Farm[];
}
