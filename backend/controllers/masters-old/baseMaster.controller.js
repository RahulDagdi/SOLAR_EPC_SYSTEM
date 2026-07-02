exports.getAll = (Model, populate = "") => async (req, res) => {
    try {

        let query = Model.find();

        if (populate) {
            query = query.populate(populate);
        }

        const data = await query.sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getById = (Model, populate = "") => async (req, res) => {
    try {

        let query = Model.findById(req.params.id);

        if (populate) {
            query = query.populate(populate);
        }

        const data = await query;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.create = (Model) => async (req, res) => {

    try {

        const data = await Model.create(req.body);

        res.status(201).json({
            success: true,
            message: "Created Successfully",
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.update = (Model) => async (req, res) => {

    try {

        const data = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.remove = (Model) => async (req, res) => {

    try {

        await Model.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};