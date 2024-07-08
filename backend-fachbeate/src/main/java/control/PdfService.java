package control;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.List;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.enterprise.context.ApplicationScoped;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.Date;

@ApplicationScoped
public class PdfService {
    public byte[] createPdf(String text) throws DocumentException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();


        document.close();

        return byteArrayOutputStream.toByteArray();

    }

}
