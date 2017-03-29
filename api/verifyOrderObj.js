var verifyOrderObj = {};

CardStore.cards = {};

CardStore.initialize = function() {
    CardStore.cards = loadCards();
};

function loadCards() {
    var file = fs.readFileSync('./cards.json');
    return JSON.parse(file.toString());
};

module.exports = verifyOrderObj;