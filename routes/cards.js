const express = require('express');
const router = express.Router();
const {data} = require('../data/flashcardData.json');
const {cards} = data;

router.get('/', (req, res) => {
    const numberOfCards = cards.length;
    const cardID = Math.floor(Math.random() * numberOfCards);
    res.redirect(`/cards/${cardID}?side=question`);
})

router.get('/:id', (req, res) => {
    try {
        let side = req.query.side;
        if (side !== "answare") {
            side = "question";
        }
        const name = req.cookies.username;
        if (!name){
            return res.redirect('/');
        }
        const {id} = req.params;
        const text = cards[id][side];
        const {hint} = cards[id];
        let templateData = {id, text, name};

        if (side === "answare"){
            templateData = {backSide: "question", ...templateData};
        } else {
            templateData = {backSide: "answare", ...templateData, ...hint};
        }

        res.render('card', templateData);
    } catch(err){
        err.message = `There are no cards with id: ${req.params.id}`;
        err.status = 404;
        res.locals.error = err;
        res.render('error');
    }
});

module.exports = router;