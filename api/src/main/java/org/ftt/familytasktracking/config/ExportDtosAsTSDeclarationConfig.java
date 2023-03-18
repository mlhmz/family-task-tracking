package org.ftt.familytasktracking.config;

import com.blueveery.springrest2ts.Rest2tsGenerator;
import com.blueveery.springrest2ts.converters.DefaultNullableTypesStrategy;
import com.blueveery.springrest2ts.converters.JacksonObjectMapper;
import com.blueveery.springrest2ts.converters.ModelClassesToTsInterfacesConverter;
import com.blueveery.springrest2ts.converters.TypeMapper;
import com.blueveery.springrest2ts.filters.ContainsSubStringJavaTypeFilter;
import com.blueveery.springrest2ts.naming.SubstringClassNameMapper;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Collections;

public class ExportDtosAsTSDeclarationConfig {
    public static void main(String[] args) throws IOException {
        Rest2tsGenerator tsGenerator = new Rest2tsGenerator();

        tsGenerator.setModelClassesCondition(new ContainsSubStringJavaTypeFilter("Dto"));

        JacksonObjectMapper jacksonObjectMapper = new JacksonObjectMapper();
        jacksonObjectMapper.setFieldsVisibility(JsonAutoDetect.Visibility.ANY);
        var modelClassesConverter = new ModelClassesToTsInterfacesConverter(jacksonObjectMapper);
        modelClassesConverter.setClassNameMapper(new SubstringClassNameMapper("Dto", ""));
        tsGenerator.setModelClassesConverter(modelClassesConverter);

        tsGenerator.getCustomTypeMapping().put(LocalDateTime.class, TypeMapper.tsDate);

        DefaultNullableTypesStrategy nullableTypesStrategy = new DefaultNullableTypesStrategy();
        nullableTypesStrategy.setUsePrimitiveTypesWrappers(false);
        tsGenerator.setNullableTypesStrategy(nullableTypesStrategy);

        var javaPackageSet = Collections.singleton("org.ftt.familytasktracking");
        Path outputDir = Paths.get("./api/build/ts-code");
        Files.createDirectories(outputDir);
        tsGenerator.generate(javaPackageSet, outputDir);
    }
}
