const https = require('https');
var axios = require('axios');
var parser = require('./fileparser')

const path = require('path');
const fs = require('fs');

const dir = "./data/";

// to import a zip, each recipe needs a new id. Let's start at 100 in hopes of avoiding a conflict.
let recipeIdStart = 100;

class melaRecipe {
  constructor() {
    this.id = '';
    this.title = '';
    this.text = '';
    this.images = [];
    this.categories = ['MyCocktails']
    this.yield = '';
    this.prepTime = '';
    this.cookTime = '';
    this.totalTime = '';
    this.ingredients = '';
    this.instructions = '';
    this.notes = '';
    this.nutrition = '';
    this.link = '';
    this.favorite = false;
    this.wantToCook = false;
    this.date = 0;
  }
}

const process = async (file) => {
  let content = parser.parseFile(file);
  let recipe = JSON.parse(content);
  let mela = new melaRecipe();

  mela.title = recipe.title;
  mela.id = `${recipeIdStart++}`;
  mela.text = recipe.description.replace(/\r\n\t/g, "\n");
  mela.ingredients = recipe.ingredients.replace(/\r\n\t/g, "\n");
  mela.images = [];
  mela.instructions = recipe.instructions.replace(/\r\n\t/g, "\n");
  // mela.nutrition = recipe.nutrition;
  mela.link = recipe["original url"];
  mela.yield = recipe.yield;
  mela.date = Date.now();

  if (recipe.image) {
    // let image = await axios.get(recipe.image, { responseType: 'arraybuffer' });
    // for some reason, this await isn't awaiting, so the files get processed out of order. ?
    let image = await getImage(recipe.image);
    let raw = Buffer.from(image.data).toString('base64');
    mela.images.push(raw);
  }

  // convert mela to string
  let melaString = JSON.stringify(mela)
  melaString = melaString.replace(/[\r\n\t]/g, "\n");

  fs.writeFileSync(dir + path.parse(file).name + ".melarecipe", melaString);

  console.log('finished', mela.title);
}

const getImage = async (url) => {
  try {
    return await axios.get(url, { responseType: 'arraybuffer' });
  } catch (error) {
    console.error(error)
  }
}

var files = fs.readdirSync(dir).map(element => {
  return path.join(dir, element)
});

const EXTENSION = '.txt';
files = files.filter(file => {
  return path.extname(file).toLowerCase() === EXTENSION;
});

files.forEach(async file => {
  console.log('start', file);
  await process(file);
  console.log('done', file);
});
