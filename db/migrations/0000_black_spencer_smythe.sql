CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) DEFAULT 'No_Name' NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp (6),
	"image" varchar(255),
	"password" varchar(255) NOT NULL,
	"role" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
