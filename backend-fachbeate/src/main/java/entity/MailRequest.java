package entity;

import jakarta.ws.rs.QueryParam;

import java.util.List;

public class MailRequest {

    public List<String> groups;
    public String id;
    public String text;
    public String subject;

    public MailRequest() {
    }
}
