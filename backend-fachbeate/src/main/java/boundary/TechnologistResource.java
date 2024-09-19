package boundary;

import entity.*;
import entity.dto.TechDateDTO;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Path("users")
public class TechnologistResource {

    private static final Logger log = LoggerFactory.getLogger(TechnologistResource.class);

    /**
     * Get all Fachberater
     * @return
     */
    @GET
    @Path("technologist")
    @Authenticated
    public Response getAllTechnologists(){

        List<Technologist> technologists = Technologist.listAll();
        technologists.sort(Comparator.comparing(technologist -> technologist.firstName.toUpperCase()));
        return Response.ok(technologists).build();
    }


    /**
     * Post new Fachberater
     * @param technologist
     */
    @POST
    @Path("technologist")
    @Authenticated
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

    /**
     * Find all Fachberater which are Active
     * @return
     */
    @GET
    @Path("technologist/allActive")
    @Authenticated
    public Response getActiveTechnologists() {


        List<Technologist> technologists = Technologist.find("active", true).list();
        technologists.sort(Comparator.comparing(technologist -> technologist.firstName.toUpperCase()));
        return Response.ok(technologists).build();

    }


    @GET
    @Path("technologist/activeWithDates")
    @Authenticated
    public Response getActiveWithResponse(){
        List<TechDateDTO> techs = Technologist.find("active", true).list().stream().map(tech -> new TechDateDTO((Technologist) tech)).toList();

        for(TechDateDTO tdd: techs){
            List<CustomerRequirement> crs = CustomerRequirement.find("requestedTechnologist.id = ?1 and endDate > ?2", tdd.technologist.id, new Date()).list();
            tdd.appointments = crs.stream().map(element -> new Date[]{element.startDate, element.endDate}).toList();
        }

        return Response.ok(techs).build();
    }
    /**
     * Post new Vertreter
     * @param representative
     */
    @POST
    @Path("representative")
    @Authenticated
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

    /**
     * Get all Vertreter
     * @return
     */
    @GET
    @Path("representative")
    @Authenticated
    public Response getAllRepresentative(){
        List<Representative> representatives = Representative.listAll();
        representatives.sort(Comparator.comparing(representative -> representative.firstName.toUpperCase()));
        return Response.ok(representatives).build();
    }

    /**
     * Find all Vertreter which are Active
     * @return
     */
    @GET
    @Authenticated
    @Path("representative/allActive")
    public Response getActiveRepresentative(){
        List<Representative> representatives = Representative.find("active", true).list();
        representatives.sort(Comparator.comparing(representative -> representative.firstName.toUpperCase()));
        return Response.ok(representatives).build();
    }

    /**
     * Post new Händler/Töchter
     * @param company
     */
    @POST
    @Authenticated
    @Path("company")
    @Transactional
    public Response postCompany(Company company){
        if(company.id == null || company.id == 0){
            company.id = null;
            company.persist();
            return Response.ok(company).build();
        }
        Company updateCompany = Company.findById(company.id);
        updateCompany.updateEntity(company);
        return Response.ok(updateCompany).build();
    }

    /**
     * Get all Händler/Töchter
     * @return
     */
    @GET
    @Authenticated
    @Path("company")
    public Response getAllCompany(){
        List<Company> companies = Company.listAll();
        companies.sort(Comparator.comparing(company -> company.name.toUpperCase()));
        return Response.ok(companies).build();
    }

    /**
     * Find all Händler/Töchter which are Active
     * @return
     */
    @GET
    @Authenticated
    @Path("company/allActive")
    public Response getActiveCompany(){
        List<Company> companies = Company.find("active", true).list();
        companies.sort(Comparator.comparing(company -> company.name.toUpperCase()));
        return Response.ok(companies).build();
    }
/* Werden im Frontend von der nicht benutzten OF gebraucht
    @GET
    @Path("mailUser")
    @Authenticated
    public Response getAllMailUser(){
        List<MailUser> mailUsers = MailUser.listAll();
        mailUsers.sort(Comparator.comparing(mailUser -> mailUser.firstName.toUpperCase()));
        return Response.ok(mailUsers).build();
    }


    @POST
    @Path("postMailUser")
    @Authenticated
    @Transactional
    public void postMailUser(MailUser mailUser){
        if(mailUser.id == null || mailUser.id == 0){
            mailUser.id = null;
            mailUser.persist();
            return;
        }
        MailUser updatedMailUser = MailUser.findById(mailUser.id);
        updatedMailUser.updateEntity(mailUser);
    }*/
}
