import {MapZoom, World } from './types';
import Canvas from 'canvas';
import staticData from './staticdata';
import fetch from 'node-fetch';
import fs from 'fs';
import { progressBar } from './progressbar';

const windowSize = process.stdout.getWindowSize()

export default class gameMap {
    
    public world: World;
    public zoom: MapZoom;
    public bar = new progressBar(windowSize[0])
    
    public totalTiles = 0
    public currentTile = 0

     constructor(world: World, zoom: MapZoom) { 

         this.world = world
         this.zoom = zoom

     }

     public async generateImage() {

        const zoom = this.zoom
        const world = this.world

        //Fetch each chunk and draw it on the canvas

        const blocksPerTile = staticData.mapScale[zoom] * staticData.tileSize;

        const tileCount =  {
            x: Math.ceil(staticData.mapSize[world].x / blocksPerTile) + 1,
            z: Math.ceil(staticData.mapSize[world].z / blocksPerTile) + 1
        }


        const canvas = Canvas.createCanvas(tileCount.x * staticData.tileSize, tileCount.z * staticData.tileSize);
        const ctx = canvas.getContext('2d');

       ctx.fillStyle = '#000000';
       ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.bar.start()

      this.bar.log(0, [{TileX: 0, TileZ: 0, buffer: 0}],  `Generating map for ${world} at zoom ${zoom}`)

       this.totalTiles = tileCount.x * tileCount.z

        //download each tile and draw it on the canvas

        let firstTileX = Math.floor(0 - (tileCount.x / 2)) 
        let firstTileZ = Math.floor(0 - (tileCount.z / 2))
        
        let lastTileX = Math.floor(tileCount.x / 2)
        let lastTileZ = Math.floor(tileCount.z / 2) 

        let tileCountX = 0
        let tileCountZ = 0 

        this.totalTiles = tileCount.x * tileCount.z
        this.currentTile = 0

        for (let x = firstTileX; x < lastTileX; x++) {
            for (let z = firstTileZ; z < lastTileZ; z++) {

                const tile = await this.getTile(x, z);

                if (tile) {

                const tileX = tileCountX * staticData.tileSize;
                const tileZ = tileCountZ * staticData.tileSize;

                ctx.drawImage(tile, tileZ, tileX);
                }

                tileCountX++;
                this.currentTile++;
            }
            tileCountZ++;
            tileCountX = 0;
        }

        this.bar.log(100, [{TileX: 0, TileZ: 0, buffer: 0}], `Saving image...`)
        fs.writeFileSync(`./output/${world}_${zoom}.png`, canvas.toBuffer())
        this.bar.log(100, [{TileX: 0, TileZ: 0, buffer: 0}], `Finished generating map for ${world} at zoom ${zoom}`)
        process.exit()
    }

    private async getTile(x: number, z: number) {

        const url = `https://zion.craftyourtown.com/tiles/${this.world}/${this.zoom}/${x}_${z}.png`;

       return fetch(url, {
            method: 'GET',
            headers: staticData.fetch.headers
        }).then(async res => {
            return await res.buffer()
        }).then(async buffer => {

            this.bar.log(this.getPercentage(this.currentTile, this.totalTiles), [{TileX: x, TileZ: z, buffer: buffer.length}], `Downloading tile ${x}_${z}`)
            const img = await Canvas.loadImage(buffer)
            return img
        }).catch(err => {
           // console.log(err);
        })


    }

    private getPercentage(current: number, total: number) {
            
            return Math.round((current / total) * 100);
    
        }


}