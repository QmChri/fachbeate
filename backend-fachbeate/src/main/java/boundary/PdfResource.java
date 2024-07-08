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
    @Path("{text}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getPdf(@PathParam("text") String text) throws DocumentException {
        byte[] pdfContent = pdfService.createPdf(text);

        return Response.ok(pdfContent)
                .header("Content-Disposition", "attachment; filename=\"example.pdf\"")
                .build();
    }

}
