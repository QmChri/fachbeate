package entity.dto;

public class FileDtos {
    public String fileName;
    public String fileContent;


    public FileDtos() {

    }

    public FileDtos(String name, String content) {
        this.fileName = name;
        this.fileContent = content;
    }
}
