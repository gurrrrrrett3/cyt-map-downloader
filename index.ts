import fetch from 'node-fetch';
import readline from 'readline';
import gameMap from './modules/gameMap';
import { progressBar } from './modules/progressbar';
import { World } from './modules/types';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What world do you want to render?\n[world, earth, world_nether, world_the_end, parkour, extras]", async (world: string) => {

    world = world.toLowerCase();
    
    if (world === "world" || world === "earth" || world === "world_nether" || world === "world_the_end" || world === "parkour" || world === "extras") {
        
        const worldType: World = world as World;

        const gm = new gameMap(worldType , "2");

        await gm.generateImage()

    } else {
        console.log("Invalid world");
        process.exit();
    }

    
})