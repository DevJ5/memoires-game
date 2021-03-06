import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn
} from "typeorm";
import User from "../users/entity";

export type Symbol = "x" | "o";
export type Row = [
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null
];
export type Board = [Row, Row, Row, Row, Row];
export type WinningCells = [[number, number], [number, number]];

type Status = "pending" | "started" | "finished";
const emptyRow: Row = [null, null, null, null, null];
const emptyBoard: Board = [emptyRow, emptyRow, emptyRow, emptyRow, emptyRow];

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("json", { default: emptyBoard })
  board: Board;

  @Column("json", { nullable: true })
  winningCells: WinningCells;

  @Column("char", { length: 1, default: "x" })
  turn: Symbol;

  @Column("char", { length: 1, nullable: true })
  winner: Symbol;

  @Column("text", { default: "pending" })
  status: Status;

  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[];
}

@Entity()
@Index(["game", "user", "symbol"], { unique: true })
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("int", { nullable: true })
  userId: number;

  @Column("char", { length: 1 })
  symbol: Symbol;

  @ManyToOne(_ => User, user => user.players)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(_ => Game, game => game.players)
  game: Game;
}
