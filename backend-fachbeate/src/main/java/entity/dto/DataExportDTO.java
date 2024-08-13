package entity.dto;

import java.sql.*;

public class DataExportDTO {
public static int cnt;
    public static void main(String[] args) throws SQLException {
        // Verbindung zur Datenbank herstellen
        String url ="jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "app";

        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            DatabaseMetaData metaData = connection.getMetaData();

            // Entity-Header
            StringBuilder entity = new StringBuilder();
            entity.append("@Entity\n");
            entity.append("public class UnifiedEntity {\n");

            // Tabellen abrufen
            ResultSet tables = metaData.getTables(null, null, "%", new String[] {"TABLE"});

            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                addColumnsToEntity(metaData, tableName, entity);
            }

            // Entity-Footer
            entity.append("}\n");
            System.out.println(cnt);
            System.out.println(entity.toString());
        }
    }

    private static void addColumnsToEntity(DatabaseMetaData metaData, String tableName, StringBuilder entity) throws SQLException {
        // Spalten der Tabelle abrufen
        ResultSet columns = metaData.getColumns(null, null, tableName, "%");

        while (columns.next()) {
            String columnName = columns.getString("COLUMN_NAME");
            String columnType = columns.getString("TYPE_NAME");

            // Erzeuge ein Feld in der Entity mit dem Format: <tableName>_<columnName>
            String fieldName = toCamelCase(tableName + "_" + columnName, false);
            entity.append("    private ").append(mapSQLTypeToJavaType(columnType))
                    .append(" ").append(fieldName).append(";\n");
        }
    }

    private static String mapSQLTypeToJavaType(String sqlType) {
        switch (sqlType) {
            case "varchar":
            case "text":
                return "String";
            case "int4":
            case "int8":
            case "serial":
            case "bigserial":
                return "Long";
            case "float4":
            case "float8":
                return "Double";
            case "bool":
                return "Boolean";
            default:
                return "Object";
        }
    }

    private static String toCamelCase(String text, boolean capitalizeFirst) {
        StringBuilder result = new StringBuilder();
        boolean nextUpperCase = capitalizeFirst;

        for (char c : text.toCharArray()) {
            if (c == '_') {
                nextUpperCase = true;
            } else {
                if (nextUpperCase) {
                    result.append(Character.toUpperCase(c));
                    nextUpperCase = false;
                } else {
                    result.append(Character.toLowerCase(c));
                }
            }
        }
        cnt++;
        return result.toString();
    }
}
