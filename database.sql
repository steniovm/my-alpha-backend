CREATE DATABASE 'my-alpha-database'
CREATE TABLE public.Users (
	"uuid" uuid NOT NULL UNIQUE,
	"email" varchar(120) NOT NULL UNIQUE,
	"password" varchar(120) NOT NULL,
	"name" varchar(240) NOT NULL,
	"birthday" DATE NOT NULL,
	"photo" varchar(255),
	"access_level" int NOT NULL,
	"created_by" varchar(32) NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_by" varchar(32),
	"updated_at" TIMESTAMP,
	"deleted_by" varchar(32),
	"deleted_at" TIMESTAMP
) WITH (
  OIDS=FALSE
);