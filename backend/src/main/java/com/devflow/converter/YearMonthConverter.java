package com.devflow.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

/**
 * Converte {@link YearMonth} para uma coluna textual "yyyy-MM" no banco.
 *
 * Sem este conversor, o Hibernate não tem mapeamento nativo para YearMonth e
 * cai no fallback de serialização Java (coluna {@code bytea}/blob), que é
 * binário, ilegível e não consultável via SQL. autoApply = true aplica a
 * conversão a todos os campos YearMonth das entidades automaticamente.
 */
@Converter(autoApply = true)
public class YearMonthConverter implements AttributeConverter<YearMonth, String> {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    @Override
    public String convertToDatabaseColumn(YearMonth attribute) {
        return attribute != null ? attribute.format(FMT) : null;
    }

    @Override
    public YearMonth convertToEntityAttribute(String dbData) {
        return dbData != null ? YearMonth.parse(dbData, FMT) : null;
    }
}
