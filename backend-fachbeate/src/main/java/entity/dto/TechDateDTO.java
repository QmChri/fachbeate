package entity.dto;

import entity.Technologist;

import java.util.Date;
import java.util.List;

public class TechDateDTO {

    public Technologist technologist;
    public List<Date[]> appointments;

    public TechDateDTO() {
    }

    public TechDateDTO(Technologist technologist) {
        this.technologist = technologist;
    }

}
