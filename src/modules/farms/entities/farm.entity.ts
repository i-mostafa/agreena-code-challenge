import { Coordinates } from "helpers/interfaces";
import { User } from "modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column({ type: "float" })
  public size: number;

  @Column({ type: "float" })
  public yield: number;

  @ManyToOne(() => User, user => user.farms, { nullable: false })
  public owner: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public address: string;

  @Column({ type: "json" })
  public coordinates: Coordinates;
}
