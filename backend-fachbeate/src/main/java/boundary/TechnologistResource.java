package boundary;

import entity.Representative;
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
        updateTechnologist.updateEntity(technologist);
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


    @POST
    @Path("representative")
    @Transactional
    public Response postRepresentative(Representative representative){
        if(representative.id == null || representative.id == 0){
            representative.id = null;
            representative.persist();
            return Response.ok(representative).build();
        }
        Representative updateRepresentative = Representative.findById(representative.id);
        updateRepresentative.updateEntity(representative);
        return Response.ok(updateRepresentative).build();
    }

    @GET
    @Path("representative")
    public Response getAllRepresentative(){
        return Response.ok(Representative.listAll()).build();
    }

    @GET
    @Path("representative/allActive")
    public Response getActiveRepresentative(){
        return Response.ok(Representative.find("active",true).list()).build();
    }


}
