module.exports = {
    put: put
};

function put(req, res) {
    let contract = req.swagger.params.contract.value;

    res.status(201).json(
        {
            message: contract
        }
    );
}