package ru.shevts.proper_anki.add;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.*;
import io.micronaut.http.annotation.*;
import io.micronaut.http.multipart.CompletedFileUpload;
import jakarta.inject.Singleton;

import java.nio.file.*;
import java.util.*;
import java.io.*;

@Controller("/api/images")
@Introspected
public class ImageController {
    private final Path dir;

    public ImageController(@io.micronaut.context.annotation.Value("${app.image-dir}") String d) throws IOException {
        dir = Path.of(d).toAbsolutePath().normalize();
        Files.createDirectories(dir);
    }

    @Post(consumes = MediaType.MULTIPART_FORM_DATA)
    public HttpResponse<?> upload(@Part("file") CompletedFileUpload f) throws IOException {
        String t = f.getContentType().map(Object::toString).orElse("");
        String e = switch (t) {
            case "image/png" -> ".png";
            case "image/jpeg" -> ".jpg";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> null;
        };
        if (e == null)
            return HttpResponse.badRequest(Map.of("message", "Only png, jpeg, gif and webp images are supported"));
        String n = UUID.randomUUID() + e;
        Files.copy(f.getInputStream(), dir.resolve(n));
        return HttpResponse.ok(Map.of("url", "/api/images/" + n));
    }

    @Get("/{name}")
    public HttpResponse<?> get(String name) throws IOException {
        Path p = dir.resolve(name).normalize();
        if (!p.getParent().equals(dir) || !Files.isRegularFile(p)) return HttpResponse.notFound();
        String e = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
        MediaType m = switch (e) {
            case "png" -> MediaType.IMAGE_PNG_TYPE;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_TYPE;
            case "gif" -> MediaType.IMAGE_GIF_TYPE;
            case "webp" -> MediaType.of("image/webp");
            default -> MediaType.APPLICATION_OCTET_STREAM_TYPE;
        };
        return HttpResponse.ok(Files.readAllBytes(p)).contentType(m);
    }
}
