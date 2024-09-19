package entity.enums;

public enum Function {
    ADMIN("admin"),
    GESCHAEFTSLEITUNG("geschaeftsleitung"),
    ABTEILUNGSLEITUNG("abteilungsleitung"),
    VERTRETER("vertreter"),
    FACHBERATER("fachberater"),
    FRONTOFFICE("front-office"),
    HAENDLERTOECHTER("haendler-toechter"),
    LEER("leer");

    private final String name;

    Function(String displayName){
        this.name = displayName;
    }

    public String getName(){
        return name;
    }

    public static Function getFunction(String name){
        for(Function f : Function.values()){
            if(f.getName().equalsIgnoreCase(name)){
                return f;
            }
        }
        return Function.LEER;
    }
}
