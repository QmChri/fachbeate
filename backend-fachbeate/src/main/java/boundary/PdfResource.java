package boundary;

import com.lowagie.text.DocumentException;
import control.PdfService;
import entity.Guest;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

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
    @Path("members/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getMembersPdf(@PathParam("id") String id) throws DocumentException {
        byte[] pdfContent = pdfService.createMembersPdf(id);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"members_list.pdf\"")
                .type("application/pdf") // Optional, aber gute Praxis
                .build();
    }

    @GET
    @Path("booking/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getBookingPdf(@PathParam("id") Long id) throws DocumentException {
        byte[] pdfContent = pdfService.createBookingPdf(id);
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
