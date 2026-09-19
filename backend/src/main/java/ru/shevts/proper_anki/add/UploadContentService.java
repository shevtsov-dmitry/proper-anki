package ru.shevts.proper_anki.add;

public class UploadContentService {

    public void contentUpload(Object content) {

//        content contains front , back content. also deck id information and specific flags. content can contain images.

        var id = database.save(content);
        // temporarily images should be saved in local files of vps. app itself will be working in docker container.
        File[] images = os.save("/some/path" + id, content.image);

        var savedMutualFlags = db.save(content.flags());

    }
}
