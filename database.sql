CREATE DATABASE 'my-alpha-database'
CREATE TABLE public.users (
	"id" serial NOT NULL,
	"email" varchar(120) NOT NULL,
	"password" varchar(120) NOT NULL,
	"name" varchar(240) NOT NULL,
	"birthday" DATE NOT NULL,
	"photo" integer,
	"uuid" varchar(32) NOT NULL UNIQUE,
	"access_level" int NOT NULL,
	"created_by" int NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_by" int,
	"updated_at" TIMESTAMP,
	"deleted_by" int,
	"deleted_at" TIMESTAMP,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.user_photo (
	"id" serial NOT NULL,
	"image" varchar(3095407) NOT NULL,
	CONSTRAINT "user_photo_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("photo") REFERENCES "user_photo"("id");

/* CREATE FUNCTION checkemail() RETURNS trigger AS $$
  BEGIN
	IF EXISTS (SELECT * FROM public.Users AS users WHERE users.email=NEW.email AND ((users.deleted_at=NEW.deleted_at) OR (users.deleted_at IS NULL AND NEW.deleted_at IS NULL))) THEN
		RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'Email já cadastrado!';
	END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER checkemail
BEFORE INSERT ON public.Users
FOR EACH ROW
EXECUTE PROCEDURE checkemail(); */