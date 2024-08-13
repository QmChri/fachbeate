package entity.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

import java.io.IOException;
import java.sql.*;

public class DataExportDTO {
    static Config config = ConfigProvider.getConfig();

    public static String getColumnData() throws SQLException, IOException {
        // JSON-Objekt erstellen
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode rootNode = mapper.createObjectNode();

        try (Connection connection = DriverManager.getConnection(
                config.getValue("quarkus.datasource.jdbc.url",String.class),
                config.getValue("quarkus.datasource.username",String.class),
                config.getValue("quarkus.datasource.password",String.class))) {
            DatabaseMetaData metaData = connection.getMetaData();

            // Tabellen abrufen und nur die Tabellen vom Schema public nehmen
            ResultSet tables = metaData.getTables(null, "public", "%", new String[]{"TABLE"});

            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                ObjectNode tableNode = mapper.createObjectNode();

                // Daten für jede Tabelle abrufen
                ResultSet dataResultSet = connection.createStatement().executeQuery("SELECT * FROM " + tableName);

                while (dataResultSet.next()) {
                    ObjectNode rowNode = mapper.createObjectNode();

                    // Spalteninformationen abrufen
                    ResultSet columns = metaData.getColumns(null, null, tableName, "%");
                    while (columns.next()) {
                        String columnName = columns.getString("COLUMN_NAME");
                        Object columnValue = dataResultSet.getObject(columnName);

                        // Wenn der Wert nicht null ist, füge ihn hinzu
                        if (columnValue != null) {
                            rowNode.put(columnName, columnValue.toString());
                        }
                    }

                    // Die Zeile in das Tabellenobjekt einfügen
                    tableNode.set(String.valueOf(dataResultSet.getRow()), rowNode);
                }

                // Tabelleninformationen hinzufügen
                rootNode.set(tableName, tableNode);
            }
        }

        // JSON in String konvertieren und zurückgeben
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(rootNode);
    }
}