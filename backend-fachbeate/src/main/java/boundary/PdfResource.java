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

    @GET
    @Path("final/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getFinalPdf(@PathParam("id") Long id) throws DocumentException {
        byte[] pdfContent = pdfService.createFinalReportPdf(id);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

    @GET
    @Path("finalList")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getFinalReportListPdf() throws DocumentException {
        byte[] pdfContent = pdfService.createFinalReportListPdf();

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

    @GET
    @Path("mainList")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getMainListPdf() throws DocumentException {
        byte[] pdfContent = pdfService.createMainListPdf();

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }
}
