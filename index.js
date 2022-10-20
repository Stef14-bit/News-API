const PORT = process.env.PORT || 8000   //for deploying on heroku
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()

const newspapers = [
    {
        name: 'rbb24',
        adress: 'https://www.rbb24.de/',
        base: ''
    },
    {
        name: 'tagesschau',
        adress: 'https://www.tagesschau.de/',
        base: ''
    },
    {
        name: 'berlinermorgenpost',
        adress: 'https://www.morgenpost.de/berlin/',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.adress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Berlin")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title, url,
                    source: newspaper.name
                })
            })
        })
});



app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].adress
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})
app.listen(PORT, () => console.log(`Server running on ${PORT}`))