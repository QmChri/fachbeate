package control;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import entity.*;
import jakarta.enterprise.context.ApplicationScoped;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.stream.Collectors;

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


    public byte[] createCustomerPdf(Long customerId)throws DocumentException{

        CustomerRequirement customerRequirement = CustomerRequirement.findById(customerId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();
        // Adding Header
        document.add(new Paragraph("Fachberater Anforderung: F_" + customerRequirement.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));

        // Adding Sections
        addSection(document, "Anforderungen durch", new String[][]{
                {"Händler/Töchter", customerRequirement.company.name},
                {"Vertreter", customerRequirement.representative.firstName + " " + customerRequirement.representative.lastName}
        });

        addSection(document, "Angeforderter Fachberater", new String[][]{
                {"Fachberater", customerRequirement.requestedTechnologist.firstName + " " + customerRequirement.requestedTechnologist.lastName},
                {"Von - Bis", customerRequirement.startDate + " - " + customerRequirement.endDate}
        });

        addSection(document, "Reiseplanung", new String[][]{
                {"Flugbuchung", customerRequirement.flightBooking?"Almi":"Kunde"},
                {"Hotelbuchung", customerRequirement.hotelBooking?"Almi":"Kunde"}
        });

        addSection(document, "Sonstiges", new String[][]{
                {"Sonstige Anmerkungen", customerRequirement.furtherNotes},
                {"Ansprechpartner vor Ort", customerRequirement.contact}
        });

        // Adding Customer Visits Table
        document.add(new Paragraph("Geplante Kundenbesuche", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph("     "));

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.addCell("Name des Unternehmens");
        table.addCell("Kundennummer");
        table.addCell("Land");
        table.addCell("Kontaktperson");
        table.addCell("Datum des Besuchs");
        table.addCell("Grund des Besuchs");
        table.addCell("Produktion Tonnen/Tag");

        for (CustomerVisit visit : customerRequirement.customerVisits) {
            table.addCell(visit.companyName);
            table.addCell(visit.customerNr);
            table.addCell(visit.address);
            table.addCell(visit.contactPerson);
            table.addCell(formatDate(visit.fromDateOfVisit) +  " - " + formatDate(visit.toDateOfVisit));
            table.addCell("TODO");
            table.addCell(visit.productionAmount);
        }

        document.add(table);

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createVisitPdf(Long visitId)throws DocumentException{

        VisitorRegistration visitorRegistration = VisitorRegistration.findById(visitId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        // Titel
        document.add(new Paragraph("Besucheranforderung: B_"+visitorRegistration.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));

        addSection(document, "Anmeldung Almi Group Mitarbeiter",  new String[][]{
                {"Name", visitorRegistration.name},
                {"Grund", visitorRegistration.reason},
                {"Von", formatDate(visitorRegistration.fromDate)},
                {"Von Uhrzeit", visitorRegistration.fromTime},
                {"Bis", formatDate(visitorRegistration.toDate)},
                {"Bis Uhrzeit", visitorRegistration.toTime}
        });

        addSection(document, "Anmeldung Kundenbesuch",  new String[][]{
                {"Kunde/Unternehmen", visitorRegistration.customerOrCompany},
                {"Anreise aus Land", visitorRegistration.arrivalFromCountry},
                {"Grund des Besuchs", visitorRegistration.reasonForVisit},
                {"English", visitorRegistration.languageEN?"Ja":"Nein"},
        });

        document.add(new Paragraph("Teilnehmer", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph("     "));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Hr./Fr./Div.");
        table.addCell("Vorname");
        table.addCell("Nachname");
        table.addCell("Funktion im Unternehmen");

        for (Guest g : visitorRegistration.guests) {
            table.addCell(g.sex == 1?"Hr.":g.sex == 2?"Fr.":"Divers");
            table.addCell(g.firstName);
            table.addCell(g.lastName);
            table.addCell(g.function);
        }
        document.add(table);


        addSection(document, "Aufenthalt in Oftering",  new String[][]{
                {"Vertreter", visitorRegistration.representative.firstName + " " + visitorRegistration.representative.lastName},
                {"Von", formatDate(visitorRegistration.stayFromDate)},
                {"Von Zeit", visitorRegistration.stayFromTime},
                {"Bis", formatDate(visitorRegistration.stayToDate)},
                {"Bis Zeit", visitorRegistration.stayToTime},
        });

        if(visitorRegistration.hotelBooking){
            document.add(new Paragraph("Hotelbuchung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable hotelbooking = new PdfPTable(4);
            hotelbooking.setWidthPercentage(100);
            hotelbooking.addCell("Ort/Lage");
            hotelbooking.addCell("Von - Bis");
            hotelbooking.addCell("EZ");
            hotelbooking.addCell("DZ");

            for (HotelBooking h : visitorRegistration.hotelBookings) {
                hotelbooking.addCell(h.hotelLocation);
                hotelbooking.addCell(formatDate(h.hotelStayFromDate) + " - " + formatDate(h.hotelStayToDate));
                hotelbooking.addCell(String.valueOf(h.singleRooms));
                hotelbooking.addCell(String.valueOf(h.doubleRooms));
            }

            document.add(hotelbooking);
        }

        if(visitorRegistration.factoryTour){
            addSection(document, "Betriebsführung",  new String[][]{
                    {"Personenanzahl", String.valueOf(visitorRegistration.numberOfPeopleTour)},
                    {"Tour Datum", formatDate(visitorRegistration.tourDate)},
                    {"Tour Zeit", visitorRegistration.tourTime},
                    {"English", visitorRegistration.tourLanguageEN?"Ja":"Nein"},
            });
        }
        if(visitorRegistration.meetingroom){
            document.add(new Paragraph("Besprechungsraum", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable meetingRoom = new PdfPTable(3);
            meetingRoom.setWidthPercentage(100);
            meetingRoom.addCell("Ort/Lage");
            meetingRoom.addCell("Datum");
            meetingRoom.addCell("Uhrzeit");

            for (MeetingRoomReservation m : visitorRegistration.meetingRoomReservations) {
                meetingRoom.addCell(m.meetingRoomLocation);
                meetingRoom.addCell(formatDate(m.meetingRoomDate));
                meetingRoom.addCell(m.meetingRoomTime);
            }
            document.add(meetingRoom);
        }

        if(visitorRegistration.airportTransferTrain){
            document.add(new Paragraph("Flughafen Transfer - Zug", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable flight = new PdfPTable(4);
            flight.setWidthPercentage(100);
            flight.addCell("Datum");
            flight.addCell("Von");
            flight.addCell("Nach");

            for (FlightBooking f : visitorRegistration.flights) {
                flight.addCell(formatDate(f.flightDate));
                flight.addCell(f.flightFrom);
                flight.addCell(f.flightTo);
            }

            document.add(flight);
        }

        if(visitorRegistration.meal){
            addSection(document, "Mittagessen",  new String[][]{
                    {"Insg. Personenanzahl", String.valueOf(visitorRegistration.lunchNumber)},
                    {"Von - Bis",formatDate(visitorRegistration.mealDateFrom) + " - " + formatDate(visitorRegistration.mealDateTo)},
                    {"Uhrzeit", visitorRegistration.lunchTime},
                    {"Vegan", String.valueOf(visitorRegistration.veganMeals)},
                    {"Halal", String.valueOf(visitorRegistration.halalMeals)},
                    {"Sonstige", visitorRegistration.otherMealsDescription},
                    {"Personenanzahl", String.valueOf(visitorRegistration.otherMealsNumber)},
            });
        }

        if(visitorRegistration.isPlannedDepartmentVisits){
            document.add(new Paragraph("Geplante Abteilungsbesuche", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable planedDepVisit = new PdfPTable(2);
            planedDepVisit.setWidthPercentage(100);
            planedDepVisit.addCell("Abteilung");
            planedDepVisit.addCell("Datum");

            for (PlannedDepartmentVisit p : visitorRegistration.plannedDepartmentVisits) {
                planedDepVisit.addCell(p.department);
                planedDepVisit.addCell(formatDate(p.dateOfVisit));
            }
            document.add(planedDepVisit);
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createWorkshop(Long workshopId)throws DocumentException{

        WorkshopRequirement workshopRequirement = WorkshopRequirement.findById(workshopId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        // Titel
        document.add(new Paragraph("Seminaranmeldung: S_"+workshopRequirement.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));

        addSection(document, "Seminar",  new String[][]{
                {"Händler/Töchter", workshopRequirement.company.name},
                {"Firma/Kunde", workshopRequirement.customer},
                {"Von - Bis", formatDate(workshopRequirement.startDate) + " - " + formatDate(workshopRequirement.endDate)},
        });

        addSection(document, "Teilnehmer",  new String[][]{
                {"Anreise aus Land", workshopRequirement.travelFrom},
                {"Anreise Art", workshopRequirement.travelType},
                {"Personenanzahl", String.valueOf(workshopRequirement.amountParticipants)},
        });

        document.add(new Paragraph("Teilnehmer", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph("     "));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Hr./Fr./Div.");
        table.addCell("Vorname");
        table.addCell("Nachname");
        table.addCell("Funktion im Unternehmen");

        for (Guest g : workshopRequirement.guests) {
            table.addCell(g.sex == 1?"Hr.":g.sex == 2?"Fr.":"Divers");
            table.addCell(g.firstName);
            table.addCell(g.lastName);
            table.addCell(g.function);
        }
        document.add(table);

        addSection(document, "Zuständigkeiten",  new String[][]{
                {"Vertreter", (workshopRequirement.representative != null)?(workshopRequirement.representative.firstName + " " + workshopRequirement.representative.lastName):""},
                {"Zuständige Fachberater", workshopRequirement.requestedTechnologist.stream().filter(Objects::nonNull)
                        .map(person -> {
                            // Null-Prüfung innerhalb der Map-Operation
                            String firstName = person.firstName != null ? person.firstName : "Unknown";
                            String lastName = person.lastName != null ? person.lastName : "Unknown";
                            return firstName + " " + lastName;
                        })
                        .collect(Collectors.joining(", "))},
                {"Sprache", workshopRequirement.language},
                {"Dolmetscher", workshopRequirement.shouldBeTranslated?"JA":"Nein"},
        });

        if(workshopRequirement.hotelBooking){
            document.add(new Paragraph("Hotelbuchung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable hotelbooking = new PdfPTable(4);
            hotelbooking.setWidthPercentage(100);
            hotelbooking.addCell("Ort/Lage");
            hotelbooking.addCell("Von - Bis");
            hotelbooking.addCell("EZ");
            hotelbooking.addCell("DZ");

            for (HotelBooking h : workshopRequirement.hotelBookings) {
                hotelbooking.addCell(h.hotelLocation);
                hotelbooking.addCell(formatDate(h.hotelStayFromDate) + " - " + formatDate(h.hotelStayToDate));
                hotelbooking.addCell(String.valueOf(h.singleRooms));
                hotelbooking.addCell(String.valueOf(h.doubleRooms));
            }

            document.add(hotelbooking);
        }

        if(workshopRequirement.companyTour){
            addSection(document, "Betriebsführung",  new String[][]{
                    {"Personenanzahl", String.valueOf(workshopRequirement.tourAmount)},
                    {"Tour Datum", formatDate(workshopRequirement.tourDate)},
                    {"Tour Zeit", workshopRequirement.tourTime}
            });
        }

        if(workshopRequirement.trip){
            addSection(document, "Ausflug",  new String[][]{
                    {"Ausflug", workshopRequirement.tripLocation},
                    {"Datum", formatDate(workshopRequirement.tourDate)},
                    {"Uhrzeit", workshopRequirement.tourTime},
                    {"Weitere Anforderungen", workshopRequirement.otherTripRequests},
            });
        }

        if(workshopRequirement.flightBooking){
            document.add(new Paragraph("Flughafen Transfer - Zug", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable flight = new PdfPTable(4);
            flight.setWidthPercentage(100);
            flight.addCell("Datum");
            flight.addCell("Von");
            flight.addCell("Nach");

            for (FlightBooking f : workshopRequirement.flights) {
                flight.addCell(formatDate(f.flightDate));
                flight.addCell(f.flightFrom);
                flight.addCell(f.flightTo);
            }

            document.add(flight);
        }

        if(workshopRequirement.meal){
            addSection(document, "Mittagessen",  new String[][]{
                    {"Insg. Personenanzahl", String.valueOf(workshopRequirement.mealAmount)},
                    {"Von - Bis",formatDate(workshopRequirement.mealDateFrom) + " - " + formatDate(workshopRequirement.mealDateTo)},
                    {"Uhrzeit", workshopRequirement.mealTime},
                    {"Vegan", String.valueOf(workshopRequirement.mealWishesVegan)},
                    {"Halal", String.valueOf(workshopRequirement.mealWishesVegetarian)},
                    {"Sonstige", workshopRequirement.otherMealWishes},
                    {"Personenanzahl", String.valueOf(workshopRequirement.otherMealWishesAmount)},
            });
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createFinalReportPdf(Long finaReportId) throws DocumentException {

        FinalReport finalReport = FinalReport.findById(finaReportId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        document.add(new Paragraph("Abschlussbericht: A_"+ finalReport.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));


        String[] reasons = new String[] {
                (finalReport.presentationOfNewProducts)? "Vorstellung neuer Produkte" : null,
                (finalReport.existingProducts) ? "Problemlösung" : null,
                (finalReport.recipeOptimization) ? "Rezeptur Optimierung" : null,
                (finalReport.sampleProduction) ? "Muster Produktion" : null,
                (finalReport.training) ? "Schulung" : null
        };
        reasons = Arrays.stream(reasons).filter(Objects::nonNull).toList().toArray(new String[0]);

        addSection(document, "Allgemeine Daten Kundenbesuche",  new String[][]{
                {"Fachberater", finalReport.technologist.firstName + " " + finalReport.technologist.lastName},
                {"Unternehmen", finalReport.company},
                {"Kundennummer", finalReport.companyNr},
                {"Vertreter", finalReport.representative.firstName + " " + finalReport.representative.lastName},
                {"Datum Besuch", formatDate(finalReport.dateOfVisit)},
                {"Grund des Besuchs", Arrays.toString(reasons).replace("[", "").replace("]", "")},
        });

        addSection(document, "Abschließender Bericht – Vertreter",  new String[][]{
                {"Weitere Produkte", finalReport.interestingProducts},
                {"Abgeschlossen", finalReport.requestCompleted?"Ja":"Nein"},
                {"Zusammenfassung Abschlussbericht", finalReport.summaryFinalReport}
          });

        reasons = new String[] {
                (finalReport.reworkInformation)? "Vorstellung neuer Produkte" : null,
                (finalReport.reworkRecipe_optimization) ? "Problemlösung" : null,
                (finalReport.reworkProduct_development) ? "Rezeptur Optimierung" : null
        };
        reasons = Arrays.stream(reasons).filter(Objects::nonNull).toList().toArray(new String[0]);

        addSection(document, "Nacharbeiten durch Fachberater", Arrays.stream(
                new String[][]{
                        {"Nacharbeit erforderlich", finalReport.reworkByTechnologist?"Ja":"Nein"},
                        {"Folgebesuch erwünscht", finalReport.reworkFollowVisits?"Ja":"Nein"},
                        (finalReport.reworkByTechnologist)?
                                new String[]{"Zu erledigen", Arrays.toString(reasons).replace("[", "").replace("]", "")}
                                :null,
                        (finalReport.reworkByTechnologist)?
                                new String[]{"Zu erledigen bis FB", formatDate(finalReport.reworkByTechnologistDoneUntil)}
                                :null
                }).filter(Objects::nonNull).toArray(String[][]::new));

        String [] reasonTitles = new String[] {"Vorstellung neuer Produkte", "Problemlösung", "Rezeptur Optimierung", "Muster Produktion"};


        document.add(new Paragraph("Berichte per Grund ", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph("     "));
        for (ReasonReport r : finalReport.reasonReports){
            document.add(new Paragraph(reasonTitles[r.reason-1], FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            document.add(new Paragraph("     "));
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.addCell(new Phrase("Artikel Nr.", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            table.addCell(new Phrase("Artikel", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            table.addCell(new Phrase("Zusammenfassung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));


            for (Article a : r.presentedArticle) {
                table.addCell(String.valueOf(a.articleNr));
                table.addCell(a.name);
                table.addCell(a.summary);
            }

            document.add(table);
        }


        document.close();

        return byteArrayOutputStream.toByteArray();
    }


    private String formatDate(Date date){
        if(date == null){
            return "";
        }
        return new SimpleDateFormat("dd.MM.yy").format(date);
    }

    private void addSection(Document document, String title, String[][] content) throws DocumentException {
        document.add(new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph("     "));
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        for (String[] row : content) {
            table.addCell(new Phrase(row[0], FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            PdfPCell rightCell = new PdfPCell(new Phrase(row[1], FontFactory.getFont(FontFactory.HELVETICA, 12)));
            rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(rightCell);
        }

        document.add(table);
        document.add(new Paragraph("\n"));
    }



}
