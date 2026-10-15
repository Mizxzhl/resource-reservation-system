--
-- PostgreSQL database dump
--

\restrict 4cY0WsOnrc8VwydcuA0KMqrqIH0eBgBiY61X4DsZdLZ4u5p7hIgQgj8a5dYQ9UC

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-10-15 12:19:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 859 (class 1247 OID 16750)
-- Name: ReservationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReservationStatus" AS ENUM (
    'ACTIVE',
    'CANCELLED'
);


ALTER TYPE public."ReservationStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16770)
-- Name: Reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reservation" (
    id integer NOT NULL,
    "resourceId" integer NOT NULL,
    "reservedBy" text NOT NULL,
    purpose text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    status public."ReservationStatus" DEFAULT 'ACTIVE'::public."ReservationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Reservation" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16769)
-- Name: Reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reservation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reservation_id_seq" OWNER TO postgres;

--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 222
-- Name: Reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reservation_id_seq" OWNED BY public."Reservation".id;


--
-- TOC entry 221 (class 1259 OID 16756)
-- Name: Resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resource" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    location text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Resource" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16755)
-- Name: Resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resource_id_seq" OWNER TO postgres;

--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 220
-- Name: Resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Resource_id_seq" OWNED BY public."Resource".id;


--
-- TOC entry 219 (class 1259 OID 16735)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4771 (class 2604 OID 16773)
-- Name: Reservation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reservation" ALTER COLUMN id SET DEFAULT nextval('public."Reservation_id_seq"'::regclass);


--
-- TOC entry 4769 (class 2604 OID 16759)
-- Name: Resource id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource" ALTER COLUMN id SET DEFAULT nextval('public."Resource_id_seq"'::regclass);


--
-- TOC entry 4932 (class 0 OID 16770)
-- Dependencies: 223
-- Data for Name: Reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reservation" (id, "resourceId", "reservedBy", purpose, "startTime", "endTime", status, "createdAt") FROM stdin;
3	3	Amal Perera	Team training session	2026-10-14 04:30:00	2026-10-14 05:45:00	CANCELLED	2026-10-14 17:45:44.414
1	2	Nimal Silva	Project planning meeting	2026-10-15 10:00:00	2026-10-15 11:00:00	CANCELLED	2026-10-14 08:03:37.118
2	2	Kavindi Fernando	Software demonstration	2026-10-15 10:00:00	2026-10-15 11:00:00	ACTIVE	2026-10-14 10:20:55.185
4	9	Dinuka Perera	Training presentation	2026-10-17 10:00:00	2026-10-17 11:00:00	ACTIVE	2026-10-15 12:16:14.853
5	5	Amal Perera	Presentation equipment booking	2026-10-16 13:00:00	2026-10-16 14:00:00	ACTIVE	2026-10-15 12:16:14.853
6	1	Nimal Silva	Project planning session	2026-10-16 10:30:00	2026-10-16 11:30:00	ACTIVE	2026-10-15 12:16:14.853
7	3	Dilan Perera	Software training session	2026-10-16 09:00:00	2026-10-16 11:00:00	ACTIVE	2026-10-15 12:16:14.853
8	8	Tharushi Silva	Development work	2026-10-16 09:00:00	2026-10-16 10:00:00	ACTIVE	2026-10-15 12:16:14.853
9	4	Kasun Perera	Workshop cancellation example	2026-10-18 10:00:00	2026-10-18 12:00:00	CANCELLED	2026-10-15 12:16:14.853
10	4	Ruwan Silva	Project review meeting	2026-10-17 09:00:00	2026-10-17 10:30:00	ACTIVE	2026-10-15 12:16:14.853
11	2	Sajith Fernando	Candidate interview	2026-10-16 14:00:00	2026-10-16 15:00:00	ACTIVE	2026-10-15 12:16:14.853
12	6	Kasun Perera	Software demonstration	2026-10-16 10:00:00	2026-10-16 11:00:00	ACTIVE	2026-10-15 12:16:14.853
13	10	Madhavi Fernando	Employee workshop	2026-10-17 13:00:00	2026-10-17 14:00:00	ACTIVE	2026-10-15 12:16:14.853
14	1	Amal Perera	Weekly team meeting	2026-10-16 09:00:00	2026-10-16 10:00:00	ACTIVE	2026-10-15 12:16:14.853
15	4	Rashmi Jayasinghe	Monthly staff meeting	2026-10-16 13:00:00	2026-10-16 15:00:00	ACTIVE	2026-10-15 12:16:14.853
16	7	Kavindi Fernando	Department discussion	2026-10-16 09:00:00	2026-10-16 10:00:00	ACTIVE	2026-10-15 12:16:14.853
17	1	Tharushi Silva	Technical interview	2026-10-17 09:00:00	2026-10-17 10:00:00	ACTIVE	2026-10-15 12:16:14.853
18	1	Ishara Silva	Product presentation	2026-10-16 15:00:00	2026-10-16 16:00:00	ACTIVE	2026-10-15 12:16:14.853
19	7	Nadeesha Perera	Client meeting	2026-10-17 09:00:00	2026-10-17 10:00:00	ACTIVE	2026-10-15 12:16:14.853
20	8	Sahan Jayasinghe	Application testing	2026-10-17 14:00:00	2026-10-17 15:00:00	ACTIVE	2026-10-15 12:16:14.853
\.


--
-- TOC entry 4930 (class 0 OID 16756)
-- Dependencies: 221
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resource" (id, name, description, location, "isActive") FROM stdin;
3	Training Room A	Training room for workshops and team sessions	Training Floor	t
1	Meeting Room A	Meeting room for team discussions and planning	Second Floor	f
2	Conference Room B	Conference room for meetings and presentations	Building 2	t
4	Conference Hall	Large venue for meetings and presentations	Second Floor	t
5	Projector 01	Projector for meetings and presentations	Equipment Store	t
6	Laptop 02	Laptop for development and testing	IT Department	t
7	Meeting Room B	Meeting room for small team discussions	First Floor	t
8	Laptop 01	Laptop for temporary work and demonstrations	IT Department	t
9	Projector 02	Portable projector for training sessions	Equipment Store	t
10	Training Room B	Room for employee training and workshops	Training Floor	t
\.


--
-- TOC entry 4928 (class 0 OID 16735)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
cd23574d-b531-435e-b021-48af41ad669a	084ff6228bf26992cede087581ee8440de893adefdfdf4df687f58e2e42c941c	2026-10-13 22:52:32.850396+05:30	20261013172232_init	\N	\N	2026-10-13 22:52:32.833994+05:30	1
\.


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 222
-- Name: Reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reservation_id_seq"', 20, true);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 220
-- Name: Resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Resource_id_seq"', 10, true);


--
-- TOC entry 4779 (class 2606 OID 16787)
-- Name: Reservation Reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 16768)
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 16748)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 16788)
-- Name: Reservation Reservation_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-10-15 12:19:45

--
-- PostgreSQL database dump complete
--

\unrestrict 4cY0WsOnrc8VwydcuA0KMqrqIH0eBgBiY61X4DsZdLZ4u5p7hIgQgj8a5dYQ9UC

