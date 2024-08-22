package boundary;

import entity.dto.DataExportDTO;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.IOException;
import java.sql.SQLException;

@Path("dataExport")
public class DataExportResource {

    @GET
    public Response getColumnData() {
        try {
            String jsonData = DataExportDTO.getColumnData();
            return Response.ok(jsonData, MediaType.APPLICATION_JSON).build();
        } catch (SQLException | IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error generating data").build();
        }
    }
}
