const Repository = require('./repository');
const News = require('./news.js');
const ImageFilesRepository = require('./imageFilesRepository.js');
const utilities = require("../utilities");
module.exports = 
class NewsRepository extends Repository {
    constructor(req){
        super('News', true);
        this.users = new Repository('Users');
        this.req = req;
        this.image = new Repository("Images");
        this.setBindExtraDataMethod(this.bindUserAndPhotoInfos);
    }
    bindUserAndPhotoInfos(news){
        if (news) {
            let user = this.users.get(news.UserId);
            let username = "unknown";
            let avatarUrl = "https://cdn-icons-png.flaticon.com/512/24/24850.png";
            if (user !== null){
                username = user.Name;
                if(user.AvatarGUID !== '')
                    avatarUrl = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
            }
            let bindedImage = {...news};
            bindedImage["Username"] = username;
            bindedImage["UserAvatar"] = avatarUrl;
            bindedImage["Date"] = utilities.secondsToDateString(news["Created"]);
            if (news["GUID"] !== ""){
                bindedImage["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(news["GUID"]);
                bindedImage["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(news["GUID"]);
            } else {
                bindedImage["OriginalURL"] = "";
                bindedImage["ThumbnailURL"] = "";
            }
            return bindedImage;
        }
        return null;
    }
    add(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.validate(news)) {
            news["GUID"] = ImageFilesRepository.storeImageData("", news["ImageData"]);
            delete news["ImageData"];
            return super.add(news);
        }
        return null;
    }
    update(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.validate(news)) {
            let foundImage = super.get(news.Id);
            if (foundImage != null) {
                if(news["ImageData"] !== undefined){
                    news["GUID"] = ImageFilesRepository.storeImageData(news["GUID"], news["ImageData"]);
                    delete news["ImageData"];
                }
                delete news["ImageData"];
                return super.update(news);
            }
        }
        return false;
    }
    remove(id){
        let foundImage = super.get(id);
        if (foundImage) {
            ImageFilesRepository.removeImageFile(foundImage["GUID"]);
            return super.remove(id);
        }
        return false;
    }
}