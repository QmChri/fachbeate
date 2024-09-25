package control;

import com.lowagie.text.Font;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import entity.*;
import entity.dto.MainListDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@ApplicationScoped
public class PdfService {
    private static final Logger LOGGER = Logger.getLogger(PdfService.class.getName());

    private static String formatStringDate(String dateString, String secondDate) {
        if (!Objects.equals(secondDate, "")) {
            try {
                SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
                SimpleDateFormat outputFormat = new SimpleDateFormat("dd.MM.yy");
                Date date = inputFormat.parse(dateString);
                Date date2 = inputFormat.parse(secondDate);
                return outputFormat.format(date) + " - " + outputFormat.format(date2);
            } catch (ParseException e) {
                // Fehler beim Parsen: Rückgabe "Unbekannt"
                return "Unbekannt";
            }
        }
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd.MM.yy");
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (ParseException e) {
            // Fehler beim Parsen: Rückgabe "Unbekannt"
            return "Unbekannt";
        }
    }

    public byte[] createPdf(String text) throws DocumentException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();


        document.close();

        return byteArrayOutputStream.toByteArray();

    }

    public byte[] createCustomerPdf(Long customerId) throws DocumentException {

        CustomerRequirement customerRequirement = CustomerRequirement.findById(customerId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();
        // Adding Header
        document.add(new Paragraph("Fachberater Anforderung: F_" + customerRequirement.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));

        // Adding Sections
        addSection(document, "Anforderungen durch", new String[][]{{"Händler/Töchter", customerRequirement.company.name}, {"Vertreter", customerRequirement.representative.firstName + " " + customerRequirement.representative.lastName}});

        addSection(document, "Angeforderter Fachberater", new String[][]{{"Fachberater", customerRequirement.requestedTechnologist.firstName + " " + customerRequirement.requestedTechnologist.lastName}, {"Von - Bis", formatDate(customerRequirement.startDate) + " - " + formatDate(customerRequirement.endDate)}});

        addSection(document, "Reiseplanung", new String[][]{{"Flugbuchung", customerRequirement.flightBooking ? "Almi" : "Kunde"}, {"Hotelbuchung", customerRequirement.hotelBooking ? "Almi" : "Kunde"}});

        addSection(document, "Sonstiges", new String[][]{{"Sonstige Anmerkungen", customerRequirement.furtherNotes}, {"Ansprechpartner vor Ort", customerRequirement.contact}});

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
            table.addCell(formatDate(visit.fromDateOfVisit) + " - " + formatDate(visit.toDateOfVisit));
            StringBuilder typeText = new StringBuilder(); // StringBuilder für bessere Performance bei String-Konkatenation

            if (visit.presentationOfNewProducts) {
                typeText.append("Vorstellung neue Produkte, ");
            }
            if (visit.existingProducts) {
                typeText.append("Problemlösung, ");
            }
            if (visit.recipeOptimization) {
                typeText.append("Rezeptur Optimierung, ");
            }
            if (visit.sampleProduction) {
                typeText.append("Muster Produktion, ");
            }
            if (visit.training) {
                typeText.append("Schulung, ");
            }
            if (!typeText.isEmpty()) {
                typeText.setLength(typeText.length() - 2); // Entfernt das letzte ", "
            } else {
                typeText.append("Unbekannter Grund");
            }

            table.addCell(typeText.toString());

            table.addCell(visit.productionAmount);
        }

        document.add(table);

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createVisitPdf(Long visitId) throws DocumentException {

        VisitorRegistration visitorRegistration = VisitorRegistration.findById(visitId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        // Titel
        document.add(new Paragraph("Besucheranmeldung: B_" + visitorRegistration.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));

        addSection(document, "Anmeldung Almi Group Mitarbeiter", new String[][]{{"Name", visitorRegistration.name}, {"Grund", visitorRegistration.reason}, {"Von", formatDate(visitorRegistration.fromDate)}, {"Von Uhrzeit", visitorRegistration.fromTime}, {"Bis", formatDate(visitorRegistration.toDate)}, {"Bis Uhrzeit", visitorRegistration.toTime}});

        if(visitorRegistration.customerOrCompany != null &&
                visitorRegistration.arrivalFromCountry != null &&
                visitorRegistration.reasonForVisit != null){

            String reasonForVisitText = switch (visitorRegistration.reasonForVisit) {
                case "0" -> "--";
                case "1" -> "Vorstellung Unternehmen";
                case "2" -> "Technologische Nacharbeitung";
                case "3" -> "Folgetermin Meetings";
                case "4" -> "Audit (QM/ QS)";
                case "5" -> "Sonstiges";
                default -> "Unbekannter Grund";
            };

            addSection(document, "Anmeldung Kundenbesuch", new String[][]{
                    {"Kunde/Unternehmen", visitorRegistration.customerOrCompany},
                    {"Anreise aus Land", visitorRegistration.arrivalFromCountry},
                    {"Grund des Besuchs", reasonForVisitText},
                    {"English", visitorRegistration.languageEN ? "Ja" : "Nein"},
            });
        }

        document.add(new Paragraph("Teilnehmer", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph("     "));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Hr./Fr./Div.");
        table.addCell("Vorname");
        table.addCell("Nachname");
        table.addCell("Funktion im Unternehmen");

        for (Guest g : visitorRegistration.guests) {
            table.addCell(g.sex == 1 ? "Hr." : g.sex == 2 ? "Fr." : "Divers");
            table.addCell(g.firstName);
            table.addCell(g.lastName);
            table.addCell(g.function);
        }
        document.add(table);

        if (visitorRegistration.representative != null) {
            addSection(document, "Aufenthalt in Oftering", new String[][]{{"Vertreter", visitorRegistration.representative.firstName + " " + visitorRegistration.representative.lastName}, {"Von", formatDate(visitorRegistration.stayFromDate)}, {"Von Zeit", visitorRegistration.stayFromTime}, {"Bis", formatDate(visitorRegistration.stayToDate)}, {"Bis Zeit", visitorRegistration.stayToTime},});
        }

        if (visitorRegistration.hotelBooking) {
            document.add(new Paragraph("Hotelbuchung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable hotelbooking = new PdfPTable(5);
            hotelbooking.setWidthPercentage(100);
            hotelbooking.addCell("Ort/Lage");
            hotelbooking.addCell("Von - Bis");
            hotelbooking.addCell("EZ");
            hotelbooking.addCell("DZ");
            hotelbooking.addCell("Zahlung");

            for (HotelBooking h : visitorRegistration.hotelBookings) {
                hotelbooking.addCell(h.hotelLocation);
                hotelbooking.addCell(formatDate(h.hotelStayFromDate) + " - " + formatDate(h.hotelStayToDate));
                hotelbooking.addCell(String.valueOf(h.singleRooms));
                hotelbooking.addCell(String.valueOf(h.doubleRooms));
                hotelbooking.addCell(String.valueOf(h.selfPay));
            }

            document.add(hotelbooking);
        }

        if (visitorRegistration.factoryTour) {
            addSection(document, "Betriebsführung", new String[][]{{"Personenanzahl", String.valueOf(visitorRegistration.numberOfPeopleTour)}, {"Tour Datum", formatDate(visitorRegistration.tourDate)}, {"Tour Zeit", visitorRegistration.tourTime}, {"English", visitorRegistration.tourLanguageEN ? "Ja" : "Nein"},});
        }
        if (visitorRegistration.meetingroom) {
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

        if (visitorRegistration.airportTransferTrain) {
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

        if (visitorRegistration.meal) {
            addSection(document, "Mittagessen", new String[][]{{"Insg. Personenanzahl", String.valueOf(visitorRegistration.lunchNumber)}, {"Von - Bis", formatDate(visitorRegistration.mealDateFrom) + " - " + formatDate(visitorRegistration.mealDateTo)}, {"Uhrzeit", visitorRegistration.lunchTime}, {"Vegan", String.valueOf(visitorRegistration.veganMeals)}, {"Halal", String.valueOf(visitorRegistration.halalMeals)}, {"Sonstige", visitorRegistration.otherMealsDescription}, {"Personenanzahl", String.valueOf(visitorRegistration.otherMealsNumber)},});
        }

        if (visitorRegistration.isPlannedDepartmentVisits) {
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

    public byte[] createWorkshop(Long workshopId) throws DocumentException {

        WorkshopRequirement workshopRequirement = WorkshopRequirement.findById(workshopId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        // Titel
        document.add(new Paragraph("Seminaranmeldung: S_" + workshopRequirement.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));

        addSection(document, "Seminar", new String[][]{{"Händler/Töchter", workshopRequirement.company.name}, {"Firma/Kunde", workshopRequirement.customer}, {"Von - Bis", formatDate(workshopRequirement.startDate) + " - " + formatDate(workshopRequirement.endDate)},});

        addSection(document, "Teilnehmer", new String[][]{{"Anreise aus Land", workshopRequirement.travelFrom}, {"Anreise Art", workshopRequirement.travelType}, {"Personenanzahl", String.valueOf(workshopRequirement.amountParticipants)},});

        document.add(new Paragraph("Teilnehmer", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph("     "));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Hr./Fr./Div.");
        table.addCell("Vorname");
        table.addCell("Nachname");
        table.addCell("Funktion im Unternehmen");

        for (Guest g : workshopRequirement.guests) {
            table.addCell(g.sex == 1 ? "Hr." : g.sex == 2 ? "Fr." : "Divers");
            table.addCell(g.firstName);
            table.addCell(g.lastName);
            table.addCell(g.function);
        }
        document.add(table);

        addSection(document, "Zuständigkeiten", new String[][]{{"Vertreter", (workshopRequirement.representative != null) ? (workshopRequirement.representative.firstName + " " + workshopRequirement.representative.lastName) : ""}, {"Zuständige Fachberater", workshopRequirement.requestedTechnologist.stream().filter(Objects::nonNull).map(person -> {
            // Null-Prüfung innerhalb der Map-Operation
            String firstName = person.firstName != null ? person.firstName : "Unknown";
            String lastName = person.lastName != null ? person.lastName : "Unknown";
            return firstName + " " + lastName;
        }).collect(Collectors.joining(", "))}, {"Sprache", workshopRequirement.language}, {"Dolmetscher", workshopRequirement.shouldBeTranslated ? "JA" : "Nein"},});

        if (workshopRequirement.hotelBooking) {
            document.add(new Paragraph("Hotelbuchung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable hotelbooking = new PdfPTable(5);
            hotelbooking.setWidthPercentage(100);
            hotelbooking.addCell("Ort/Lage");
            hotelbooking.addCell("Von - Bis");
            hotelbooking.addCell("EZ");
            hotelbooking.addCell("DZ");
            hotelbooking.addCell("Zahlung");

            for (HotelBooking h : workshopRequirement.hotelBookings) {
                hotelbooking.addCell(h.hotelLocation);
                hotelbooking.addCell(formatDate(h.hotelStayFromDate) + " - " + formatDate(h.hotelStayToDate));
                hotelbooking.addCell(String.valueOf(h.singleRooms));
                hotelbooking.addCell(String.valueOf(h.doubleRooms));
                hotelbooking.addCell(String.valueOf(h.selfPay));
            }

            document.add(hotelbooking);
        }

        if (workshopRequirement.companyTour) {
            addSection(document, "Betriebsführung", new String[][]{{"Personenanzahl", String.valueOf(workshopRequirement.tourAmount)}, {"Tour Datum", formatDate(workshopRequirement.tourDate)}, {"Tour Zeit", workshopRequirement.tourTime}});
        }

        if (workshopRequirement.trip) {
            addSection(document, "Ausflug", new String[][]{{"Ausflug", workshopRequirement.tripLocation}, {"Datum", formatDate(workshopRequirement.tourDate)}, {"Uhrzeit", workshopRequirement.tourTime}, {"Weitere Anforderungen", workshopRequirement.otherTripRequests},});
        }

        if (workshopRequirement.flightBooking) {
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

        if (workshopRequirement.meal) {
            addSection(document, "Mittagessen", new String[][]{{"Insg. Personenanzahl", String.valueOf(workshopRequirement.mealAmount)}, {"Von - Bis", formatDate(workshopRequirement.mealDateFrom) + " - " + formatDate(workshopRequirement.mealDateTo)}, {"Uhrzeit", workshopRequirement.mealTime}, {"Vegan", String.valueOf(workshopRequirement.mealWishesVegan)}, {"Halal", String.valueOf(workshopRequirement.mealWishesVegetarian)}, {"Sonstige", workshopRequirement.otherMealWishes}, {"Personenanzahl", String.valueOf(workshopRequirement.otherMealWishesAmount)},});
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createBookingPdf(Long bookingId) throws DocumentException {

        BookingRequest bookingRequest = BookingRequest.findById(bookingId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        // Titel
        document.add(new Paragraph("Reiseanforderung: R_" + bookingRequest.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));

        addSection(document, "Reiseanforderung für Geschäftsreise", new String[][]
                {{"Name Mitarbeiter", bookingRequest.employeeNameAndCompany},
                        {"Grund Reise", bookingRequest.reasonForTrip},
                        {"Von", formatDate(bookingRequest.mainStartDate)},
                        {"Bis", formatDate(bookingRequest.mainEndDate)},
                        {"Sonstige Anmerkungen", bookingRequest.otherNotes}});

        if (bookingRequest.hotelBooking) {
            document.add(new Paragraph("Hotelbuchung", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable hotelbooking = new PdfPTable(3);
            hotelbooking.setWidthPercentage(100);
            hotelbooking.addCell("Ort und gewünschte Lage");
            hotelbooking.addCell("Von - Bis");
            hotelbooking.addCell("Sonstige Anmerkungen");

            for (HotelBooking h : bookingRequest.hotelBookings) {
                hotelbooking.addCell(h.hotelLocation);
                hotelbooking.addCell(formatDate(h.hotelStayFromDate) + " - " + formatDate(h.hotelStayToDate));
                hotelbooking.addCell(String.valueOf(h.otherHotelNotes));
            }

            document.add(hotelbooking);
        }

        if (bookingRequest.carRental) {
            addSection(document, "Leihwagen Buchung", new String[][]
                    {{"Ort Abholung und Rückgabe", String.valueOf(bookingRequest.carLocation)},
                   {"Von - Bis", formatDate(bookingRequest.carFrom) + " - " + formatDate(bookingRequest.carTo)},
                   {"Sonstige Anmerkungen", bookingRequest.otherCarNotes}});
        }

        if (bookingRequest.otherReq) {
            addSection(document, "Sonstige Anforderungen", new String[][]
                    {{"Gepäck Anzahl", String.valueOf(bookingRequest.luggageCount)},
                    {"Gewicht(kg)", String.valueOf(bookingRequest.luggageWeight)},
                    {"Bevorzugter Sitzplatz", String.valueOf(bookingRequest.windowCorridor)},
                    {"Bevorzugte Arbeitszeit", String.valueOf(bookingRequest.preferredTime)},
                    {"Sonstiges", String.valueOf(bookingRequest.otherReqOtherNotes)}});
        }

        if (bookingRequest.trainTicketBooking) {
            addSection(document, "Buchung Zugticket", new String[][]
                    {{"Von Bahnhof", String.valueOf(bookingRequest.trainFrom)},
                    {"Nach Bahnhof", String.valueOf(bookingRequest.trainTo)},
                    {"Von", formatDate(bookingRequest.trainStartDate)},
                    {"Bis", formatDate(bookingRequest.trainEndDate)},
                    {"Sonstige Anmerkungen", bookingRequest.trainOtherNotes}});
        }

        if (bookingRequest.flightBookingRoundTrip) {
            addSection(document, "Flug Buchung Hin- / Retour", new String[][]
                    {{"Von Flughafen", String.valueOf(bookingRequest.flightFrom)},
                            {"Alternativer Flughafen", String.valueOf(bookingRequest.alternativeFlightFrom)},
                            {"Nach Flughafen",  String.valueOf(bookingRequest.flightTo)},
                            {"Alternativer Flughafen",  String.valueOf(bookingRequest.alternativeFlightTo)}
                    });
        }

        if (bookingRequest.flightBookingMultiLeg) {
            document.add(new Paragraph("Flug Buchung Gabelflüge", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("     "));
            PdfPTable flightBookingMultiLeg = new PdfPTable(6);
            flightBookingMultiLeg.setWidthPercentage(100);
            flightBookingMultiLeg.addCell("Datum");
            flightBookingMultiLeg.addCell("Von Flughafen");
            flightBookingMultiLeg.addCell("Alternativer Flughafen");
            flightBookingMultiLeg.addCell("Nach Flughafen");
            flightBookingMultiLeg.addCell("Alternativer Flughafen");
            flightBookingMultiLeg.addCell("Sonstige Anmerkungen");

            for (AdvancedFlightBooking p : bookingRequest.flights) {
                flightBookingMultiLeg.addCell(formatDate(p.flightDate));
                flightBookingMultiLeg.addCell(String.valueOf(p.flightFrom));
                flightBookingMultiLeg.addCell(String.valueOf(p.flightFrom));
                flightBookingMultiLeg.addCell(String.valueOf(p.flightTo));
                flightBookingMultiLeg.addCell(String.valueOf(p.alternativeFlightFrom));
                flightBookingMultiLeg.addCell(String.valueOf(p.otherNotes));
            }
            document.add(flightBookingMultiLeg);
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createMembersPdf(String text) throws DocumentException {
        List<Guest> guests = null;
        String type = text.split("_")[0];
        String id = text.split("_")[1];
        System.out.println(id);
        System.out.println(text);
        if (Objects.equals(type, "S"))
        {
            WorkshopRequirement w= WorkshopRequirement.findById(id);
            System.out.println(w);
            guests=w.guests.stream().toList();
        }
        else  if (Objects.equals(type, "B")){
            VisitorRegistration f = VisitorRegistration.findById(id);
            System.out.println(f);
            guests=f.guests.stream().toList();
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();
        Date date = new Date();

        // Titel
        document.add(new Paragraph("Teilnehmerliste: T_" + formatDate(date), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));
        document.add(new Paragraph("     ")); // Leerzeile

        // Tabelle erstellen
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Hr./Fr./Div.");
        table.addCell("Vorname");
        table.addCell("Nachname");
        table.addCell("Funktion im Unternehmen");

        for (Guest p : guests) {
            String gender;
            switch (p.sex) {
                case 1:
                    gender = "Herr";
                    break;
                case 2:
                    gender = "Frau";
                    break;
                default:
                    gender = "Divers";
                    break;
            }
            table.addCell(gender);
            table.addCell(p.firstName != null ? p.firstName : "");
            table.addCell(p.lastName != null ? p.lastName : "");
            table.addCell(p.function != null ? p.function : "");
        }

        // Tabelle zum Dokument hinzufügen
        document.add(table);

        // Dokument schließen
        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createFinalReportPdf(Long finaReportId) throws DocumentException {

        FinalReport finalReport = FinalReport.findById(finaReportId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        document.add(new Paragraph("Abschlussbericht: A_" + finalReport.id, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.BOLD)));


        String[] reasons = new String[]{(finalReport.presentationOfNewProducts) ? "Vorstellung neuer Produkte" : null, (finalReport.existingProducts) ? "Problemlösung" : null, (finalReport.recipeOptimization) ? "Rezeptur Optimierung" : null, (finalReport.sampleProduction) ? "Muster Produktion" : null, (finalReport.training) ? "Schulung" : null};
        reasons = Arrays.stream(reasons).filter(Objects::nonNull).toList().toArray(new String[0]);

        addSection(document, "Allgemeine Daten Kundenbesuche", new String[][]{{"Fachberater", finalReport.technologist.firstName + " " + finalReport.technologist.lastName}, {"Unternehmen", finalReport.company}, {"Kundennummer", finalReport.companyNr}, {"Vertreter", finalReport.representative.firstName + " " + finalReport.representative.lastName}, {"Datum Besuch", formatDate(finalReport.dateOfVisit)}, {"Grund des Besuchs", Arrays.toString(reasons).replace("[", "").replace("]", "")},});

        addSection(document, "Abschließender Bericht – Vertreter", new String[][]{{"Weitere Produkte", finalReport.interestingProducts}, {"Abgeschlossen", finalReport.requestCompleted ? "Ja" : "Nein"}, {"Zusammenfassung Abschlussbericht", finalReport.summaryFinalReport}});

        reasons = new String[]{(finalReport.reworkInformation) ? "Vorstellung neuer Produkte" : null, (finalReport.reworkRecipe_optimization) ? "Problemlösung" : null, (finalReport.reworkProduct_development) ? "Rezeptur Optimierung" : null};
        reasons = Arrays.stream(reasons).filter(Objects::nonNull).toList().toArray(new String[0]);

        addSection(document, "Nacharbeiten durch Fachberater", Arrays.stream(new String[][]{{"Nacharbeit erforderlich", finalReport.reworkByTechnologist ? "Ja" : "Nein"}, {"Folgebesuch erwünscht", finalReport.reworkFollowVisits ? "Ja" : "Nein"}, (finalReport.reworkByTechnologist) ? new String[]{"Zu erledigen", Arrays.toString(reasons).replace("[", "").replace("]", "")} : null, (finalReport.reworkByTechnologist) ? new String[]{"Zu erledigen bis FB", formatDate(finalReport.reworkByTechnologistDoneUntil)} : null}).filter(Objects::nonNull).toArray(String[][]::new));

        String[] reasonTitles = new String[]{"Vorstellung neuer Produkte", "Problemlösung", "Rezeptur Optimierung", "Muster Produktion"};


        document.add(new Paragraph("Berichte per Grund ", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph("     "));
        for (ReasonReport r : finalReport.reasonReports) {
            document.add(new Paragraph(reasonTitles[r.reason - 1], FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
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

    public byte[] createFinalReportListPdf() throws DocumentException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        List<FinalReport> finalReports = FinalReport.listAll();

        // Dokument im Querformat erstellen
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        // Titel mit Abstand
        Paragraph title = new Paragraph("Übersicht Abschlussberichte", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);  // Leere Zeile für Abstand

        // Tabelle mit 9 Spalten erstellen
        PdfPTable table = new PdfPTable(9);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        // Spaltenbreiten festlegen
        float[] columnWidths = {0.7f, 1.2f, 2f, 2f, 2f, 2f, 2f, 2.2f, 3f};
        table.setWidths(columnWidths);

        // Tabellenkopf formatieren
        String[] columnTitles = {"Id", "Kunde", "Datum des Besuchs", "Zuständiger Vertreter", "Kunde kontaktiert am", "Zuständiger FB", "Zu erledigen bis FB", "Bericht abgeschlossen", "Artikel Nr."};
        for (String titleText : columnTitles) {
            PdfPCell header = new PdfPCell(new Phrase(titleText, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            header.setHorizontalAlignment(Element.ALIGN_CENTER);
            header.setPadding(10);
            header.setBackgroundColor(Color.LIGHT_GRAY);
            table.addCell(header);
        }

        // Daten in die Tabelle einfügen
        for (FinalReport reports : finalReports) {
            table.addCell(createCell(String.valueOf(reports.id), Element.ALIGN_CENTER));
            table.addCell(createCell(reports.company, Element.ALIGN_CENTER));
            table.addCell(createCell(formatDate(reports.dateOfVisit), Element.ALIGN_CENTER));
            table.addCell(createCell(reports.representative.firstName + " " + reports.representative.lastName, Element.ALIGN_CENTER));
            table.addCell(createCell(formatDate(reports.customerContactDate), Element.ALIGN_CENTER));
            table.addCell(createCell(reports.technologist.firstName + " " + reports.technologist.lastName, Element.ALIGN_CENTER));
            table.addCell(createCell(formatDate(reports.doneUntil), Element.ALIGN_CENTER));
            table.addCell(createCell(reports.requestCompleted ? "Ja" : "Nein", Element.ALIGN_CENTER));

            // Artikel Nummern begrenzen und formatieren
            String articles = reports.reasonReports.stream().flatMap(reason -> reason.presentedArticle.stream().map(article -> article.articleNr)).toList().toString().replace("[", "").replace("]", "");

            PdfPCell articleCell = createCell(articles, Element.ALIGN_CENTER);
            table.addCell(articleCell);
        }

        // Tabelle zum Dokument hinzufügen
        document.add(table);
        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    public byte[] createMainListPdf() throws DocumentException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        List<MainListDTO> mainListDTOS = MainListDTO.getEntrysForPdf(20);

        // Dokument im Querformat erstellen
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        // Titel mit Abstand
        Paragraph title = new Paragraph("Übersicht Anforderungen und Anmeldungen", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);  // Leere Zeile für Abstand

        // Tabelle mit 11 Spalten erstellen
        PdfPTable table = new PdfPTable(11);
        table.setWidthPercentage(100);

        // Spaltenbreiten festlegen
        float[] columnWidths = {2f, 2f, 4f, 2.5f, 2.5f, 3f, 4f, 2f, 2.5f, 2.5f, 2.5f};
        table.setWidths(columnWidths);

        // Tabellenkopf formatieren
        String[] columnTitles = {"Id", "Erstelldatum", "Angefordert durch", "Freigabe GL/AL", "Vertreter", "Fachberater", "Angeforderter Zeitraum", "Kunde", "Berichte", "Typ", "Storniert"};
        for (String titleText : columnTitles) {
            PdfPCell header = new PdfPCell(new Phrase(titleText, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
            header.setHorizontalAlignment(Element.ALIGN_CENTER);
            header.setPadding(10);
            header.setBackgroundColor(Color.LIGHT_GRAY);
            table.addCell(header);
        }

        // Daten in die Tabelle einfügen
        for (MainListDTO dto : mainListDTOS) {
            // Füge jede Zelle der Tabelle hinzu
            table.addCell(createCell(String.valueOf(dto.id), Element.ALIGN_CENTER));
            table.addCell(createCell(formatStringDate(dto.dateOfCreation, ""), Element.ALIGN_CENTER));
            table.addCell(createCell(dto.customerOrCompany != null ? dto.customerOrCompany : "", Element.ALIGN_CENTER));

            String symbolGL = dto.statusGL.equals("GL Freigegeben")  ? "Ja \n" : "Nein \n";
            String symbolAL = dto.statusAL.equals("AL Freigegeben")  ? "Ja \n" : "Nein \n";
            String combinedStatus = String.format("GL: %sAL: %s", symbolGL, symbolAL);
            table.addCell(createCell(combinedStatus, Element.ALIGN_CENTER));

            table.addCell(createCell(dto.representative != null ? dto.representative : "", Element.ALIGN_CENTER));
            table.addCell(createCell(dto.technologist != null ? dto.technologist : "", Element.ALIGN_CENTER));
            table.addCell(createCell(formatStringDate(dto.fromDate, dto.toDate), Element.ALIGN_CENTER));
            table.addCell(createCell(dto.customer != null ? dto.customer : "", Element.ALIGN_CENTER));
            table.addCell(createCell(dto.finalReport != null ? dto.finalReport : "", Element.ALIGN_CENTER));
            String typeText = switch (dto.type) {
                case 0 -> "Besuch";
                case 1 -> "Fachberater A.";
                case 2 -> "Seminar";
                default -> "Unbekannt";
            };
            table.addCell(createCell(typeText, Element.ALIGN_CENTER));
            table.addCell(createCell(dto.visible ? "Nein" : "Ja", Element.ALIGN_CENTER));
        }

// Tabelle zum Dokument hinzufügen
        document.add(table);
        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    private PdfPCell createCell(String content, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(content, FontFactory.getFont(FontFactory.HELVETICA, 8)));
        cell.setPadding(8);
        cell.setHorizontalAlignment(alignment);
        return cell;
    }

    private String formatDate(Date date) {
        if (date == null) {
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
