CREATE DATABASE 'my-alpha-database'
CREATE TABLE public.Users (
	"id" serial NOT NULL,
	"email" varchar(120) NOT NULL,
	"password" varchar(120) NOT NULL,
	"name" varchar(240) NOT NULL,
	"birthday" DATE NOT NULL,
	"photo" varchar(255),
	"uuid" varchar(32) NOT NULL UNIQUE,
	"access_level" int NOT NULL,
	"created_by" int NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_by" int,
	"updated_at" TIMESTAMP,
	"deleted_by" int,
	"deleted_at" TIMESTAMP,
	CONSTRAINT "Users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);