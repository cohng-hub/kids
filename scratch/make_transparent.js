const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function processImage(filename) {
  const filePath = path.join(__dirname, '../assets', filename);
  if (!fs.existsSync(filePath)) return;

  console.log(`Processing ${filename}...`);
  const image = await Jimp.read(filePath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    const avg = (r + g + b) / 3;
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));

    if (avg > 210 && maxDiff < 25) {
      this.bitmap.data[idx + 3] = 0;
    } else if (avg > 180 && maxDiff < 20) {
      const alpha = Math.max(0, 255 - Math.round((avg - 180) * 8.5));
      this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
    }
  });

  await image.write(filePath);
  console.log(`Finished ${filename}!`);
}

async function main() {
  const files = [
    'classtree_3d_seed_character.png',
    'classtree_3d_sprout.png',
    'classtree_3d_sapling.png',
    'classtree_3d_blossom_tree.png',
    'classtree_3d_fruit_tree.png',
    'classtree_3d_spring_forest.png',
    'classtree_3d_tree.png',
    'classtree_3d_robot_part.png',
    'classtree_3d_robot_core.png',
    'classtree_3d_robot.png',
    'classtree_3d_robot_booster.png',
    'classtree_3d_robot_spaceship.png',
    'classtree_3d_robot_galaxy.png',
    'classtree_3d_train_locomotive.png',
    'classtree_3d_train.png',
    'classtree_3d_train_books.png',
    'classtree_3d_train_rainbow.png',
    'classtree_3d_train_express.png',
    'classtree_3d_train_treasure.png',
    'classtree_3d_castle_cabin.png',
    'classtree_3d_castle_igloo.png',
    'classtree_3d_castle.png',
    'classtree_3d_castle_palace.png',
    'classtree_3d_ice_castle.png',
    'classtree_3d_castle_kingdom.png',
    'classtree_3d_puzzle_piece.png',
    'classtree_3d_puzzle.png',
    'classtree_3d_puzzle_sparkle.png',
    'classtree_3d_puzzle_frame.png',
    'classtree_3d_puzzle_gold.png',
    'classtree_3d_puzzle_diploma.png'
  ];

  for (const f of files) {
    try {
      await processImage(f);
    } catch (e) {
      console.error(`Error on ${f}:`, e);
    }
  }
}

main();
