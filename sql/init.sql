CREATE TABLE "instrument" (
  id                    uuid CONSTRAINT instrument_id PRIMARY KEY,
  createdAt             date NOT NULL DEFAULT current_timestamp,
  updatedAt             date NOT NULL DEFAULT current_timestamp,

  model                 varchar(255) NOT NULL,
  type                  varchar(50) NOT NULL,
  serial                varchar(50) NOT NULL,
  registry              varchar(50) NULL,
  pastCertificateSign   varchar(50) NULL
);
CREATE INDEX idx_inst_model ON "instrument" (model);

CREATE TABLE "certificate" (
  id                    uuid CONSTRAINT certificate_id PRIMARY KEY,
  createdAt             date NOT NULL DEFAULT current_timestamp,
  updatedAt             date NOT NULL DEFAULT current_timestamp,

  instrumentId          uuid NOT NULL REFERENCES instrument(id) ON DELETE CASCADE,
  number                varchar(50) NOT NULL,
  sign                  varchar(255) NOT NULL,
  issuer                varchar(255) NOT NULL,
  date                  date NULL,
  comments              text NOT NULL
);
CREATE INDEX idx_cert_indstument_fk ON "certificate" (instrumentId);
CREATE INDEX idx_cert_date ON "certificate" (date);

CREATE TABLE "order" (
  id                    uuid CONSTRAINT order_id PRIMARY KEY,
  createdAt             date NOT NULL DEFAULT current_timestamp,
  updatedAt             date NOT NULL DEFAULT current_timestamp,

  instrumentId          uuid NOT NULL REFERENCES instrument(id) ON DELETE CASCADE,
  client                varchar(255) NOT NULL,
  bill                  varchar(255) NOT NULL,
  number                varchar(50) NOT NULL,
  service               text NOT NULL,
  comments              text NOT NULL,
  status                varchar(50) NOT NULL,

  arrivedToApproverAt   date,
  arrivedAt             date NULL,
  deadlineAt            date NULL,
  departedAt            date NULL
);
CREATE INDEX idx_order_indstument_fk ON "order" (instrumentId);
CREATE INDEX idx_order_arrivedToApproverAt ON "order" (arrivedToApproverAt);
