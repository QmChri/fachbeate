package boundary;

import entity.Technologist;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("technologist")
public class TechnologistResource {

    @POST
    @Transactional
    public void postTechnologist(Technologist technologist){
        if(technologist.id == null || technologist.id == 0){
            technologist.id = null;
            technologist.persist();
            return;
        }
        Technologist updateTechnologist = Technologist.findById(technologist.id);
        updateTechnologist.update(technologist);
    }

    @GET
    public Response getAllTechnologists(){
        return Response.ok(Technologist.listAll()).build();
    }

    @GET
    @Path("allActive")
    public Response getActiveTechnologists(){
        return Response.ok(Technologist.find("active",true).list()).build();
    }

}
