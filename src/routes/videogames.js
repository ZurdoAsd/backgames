const express = require("express");
const router = express.Router();
const videogames = require("../models/videogames");

const { getForQuery, getAllGames } = require("../Controlers/GETvideogames");
const {
  getVideogamesID,
  // editVideogamesID,
  // deleteVideogamesID,
} = require("../Controlers/IDvideogames");
// const { CreateVideogame } = require("../Controlers/CREATEvideogames");

// GET all
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    const AllVideogames = await getAllGames();
    
    if (name) {
      const getquery = getForQuery(name,AllVideogames);
      getquery.length
      ?res.status(200).json(getquery)
      :res.status(404).json("no existe el juego");
    } else {
      const AllVideogamesSorted= AllVideogames.sort((a, b) => { return (a.name.toLowerCase() > b.name.toLowerCase())?1:-1});
      res.status(200).send(AllVideogamesSorted);
    }
  }catch (error) {
    console.log(error);
  }
});
// GET id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    
    const getforid = await getVideogamesID(id);
    getforid?res.json(getforid)
    :res.status(404).json("no existe el juego");
  } catch (error) {
    console.log(error);
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const aux =
      "https://ceinaseg.com/wp-content/uploads/2021/09/videogames-controller-1920x1080-1.jpg";
    const {
      name,
      image,
      background_image,
      description,
      released,
      rating,
      genres,
      platforms,
    } = req.body;

    if (!name || !description || !platforms || !genres) {
      res.status(404).send("Falta data");
    }
    const data= {
      name,
      image,
      background_image: background_image ? background_image : aux,
      description,
      released,
      rating,
      platforms,
      genres,
      database_origin: true,
    }
    const newGame = new videogames(data);
    await newGame.save();
    res.status(200).json(newGame);
  } catch (error) {
    console.log(error);
  }
});
// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, released, description, platforms, genres } = req.body;
    const editVideogamesID = {
      name,
      rating,
      released,
      description,
      platforms,
      genres,
    };
    await videogames.findByIdAndUpdate(id, editVideogamesID);
    res.json("Updated");
  } catch (error) {
    console.log(error.message);
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await videogames.findByIdAndRemove(id);
    res.json("Deleted");
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
