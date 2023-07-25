import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("website")
export class WebsiteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "domain", length: 255 })
  domain: string;

  @Column("varchar", {
    name: "company_commercial_name",
    length: 255,
    nullable: true,
  })
  commercial_name?: string;

  @Column("varchar", {
    name: "company_legal_name",
    length: 255,
    nullable: true,
  })
  legal_name?: string;

  @Column("varchar", {
    name: "company_all_available_names",
    length: 255,
    nullable: true,
  })
  all_available_names?: string;

  @Column("varchar", { name: "phone_numbers", array: true, nullable: true })
  phone_numbers?: string[];

  @Column("varchar", { name: "social_media", array: true, nullable: true })
  social_media?: string[];

  @Column("varchar", { name: "address", array: true, nullable: true })
  address?: string[];

  @CreateDateColumn()
  createdAt: Date;
}
