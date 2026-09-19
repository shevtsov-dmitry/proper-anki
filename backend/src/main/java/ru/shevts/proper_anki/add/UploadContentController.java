package ru.shevts.proper_anki.add;

import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import jakarta.annotation.Resource;

@Resource(name = "/api/v0/content")
public class UploadContentController {

    UploadContentService service = new UploadContentService();

    /**
     * 
     * @return
     */
    @Post("/new")
    public Resource contentUpload(Object content) {
                service.contentUpload(content);

    }


}
