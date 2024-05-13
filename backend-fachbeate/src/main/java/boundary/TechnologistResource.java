package boundary;

import entity.Technologist;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("technologist")
public class TechnologistResource {

    @POST
    public void postTechnologist(Technologist technologist){
        if(technologist.id == null || technologist.id == 0){
            technologist.persist();
            return;
        }
    }

    @GET
    @Path("allActive")
    public Response getActiveTechnologist(){
        return Response.ok(Technologist.find("active",true).list()).build();
    }

}
