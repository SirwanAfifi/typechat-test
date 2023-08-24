export interface DatabaseSchema {
  databaseName: string;
  tables: Table[];
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Column {
  name: string;
  type:
    | "BIT"
    | "TINYINT"
    | "SMALLINT"
    | "MEDIUMINT"
    | "INT"
    | "INTEGER"
    | "BIGINT"
    | "REAL"
    | "DOUBLE"
    | "FLOAT"
    | "DECIMAL"
    | "NUMERIC"
    | "DATE"
    | "TIME"
    | "TIMESTAMP"
    | "DATETIME"
    | "VARCHAR(255)"
    | "TEXT"
    | "JSON";
  allowNull: boolean;
}
