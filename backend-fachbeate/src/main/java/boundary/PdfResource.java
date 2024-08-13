package boundary;

import com.lowagie.text.DocumentException;
import control.PdfService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("pdf")
public class PdfResource {

    @Inject
    PdfService pdfService;

    @GET
    @Path("customer/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getPdf(@PathParam("id") Long id) throws DocumentException {
        byte[] pdfContent = pdfService.createCustomerPdf(id);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

    @GET
    @Path("visit/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getVisitPdf(@PathParam("id") Long id) throws DocumentException {
        byte[] pdfContent = pdfService.createVisitPdf(id);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

    @GET
    @Path("workshop/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getWorkshopPdf(@PathParam("id") Long id) throws DocumentException {
        byte[] pdfContent = pdfService.createWorkshop(id);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

}
