module.exports =
class News{
    constructor(title, text, image, created, userId, GUID)
    {
        this.Id = 0;
        this.UserId = userId !== undefined ? userId : 0;
        this.Title = title !== undefined ? title : "";
        this.Image = image !== undefined ? image : null;
        this.Text = text !== undefined ? text : "";
        this.Created = created !== undefined ? created : 0;
        this.GUID = GUID !== undefined ? GUID : "";
    }

    static validate(instance) {
        const Validator = new require('./validator');
        let validator = new Validator();
        validator.addField('Id','integer');
        validator.addField('Title','string');
        validator.addField('Text','string');
        validator.addField('UserId', 'integer');
        validator.addField('Created','integer');
        return validator.test(instance);
    }
}